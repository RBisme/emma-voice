require("dotenv").config({ path: "C:/TM/brain/.env" });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Anthropic = require("@anthropic-ai/sdk");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/stream") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// ---------- Load Emma's personality ----------
const EMMA_PROMPT = fs.readFileSync(
  path.join(__dirname, "emma_sales_prompt.txt"),
  "utf8"
);

// ---------- Anthropic client ----------
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ---------- μ-law decode (Twilio -> PCM16) ----------
function muLawToPCM16(muLawBuf) {
  const BIAS = 33;
  const pcm = new Int16Array(muLawBuf.length);
  for (let i = 0; i < muLawBuf.length; i++) {
    let mu = ~muLawBuf[i];
    let sign = mu & 0x80;
    let exponent = (mu >> 4) & 0x07;
    let mantissa = mu & 0x0f;
    let sample = ((mantissa << 4) + BIAS) << exponent;
    sample = sign ? BIAS - sample : sample - BIAS;
    pcm[i] = sample;
  }
  return pcm;
}

// ---------- Twilio webhook ----------
app.post("/voice", express.urlencoded({ extended: false }), (req, res) => {
  const wsUrl = `wss://${req.headers.host}`;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}/stream" />
  </Connect>
</Response>`;
  res.type("text/xml");
  res.send(twiml);
});

// ---------- Health check ----------
app.get("/", (req, res) => res.send("Emma voice server running ✅"));

// ---------- Main WebSocket handler ----------
wss.on("connection", (ws, req) => {
  // Only handle /stream path
  if (!req.url.includes("/stream")) {
    ws.close();
    return;
  }

  console.log("📞 Call connected");

  let streamSid = null;
  let conversationHistory = [];
  let deepgramWs = null;
  let isSpeaking = false;
let isProcessing = false;
let currentUtterance = "";
let utteranceTimer = null;

  // ---------- Connect to Deepgram ----------
  function connectDeepgram() {
    const dgUrl =
      "wss://api.deepgram.com/v1/listen?" +
      "model=nova-2&" +
      "language=en-US&" +
      "encoding=mulaw&" +
      "sample_rate=8000&" +
      "channels=1&" +
      "interim_results=true&" +
      "utterance_end_ms=1500&" +
      "vad_events=true&" +
      "endpointing=1200";

    deepgramWs = new WebSocket(dgUrl, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    });

    deepgramWs.on("open", () => {
      console.log("🎤 Deepgram listening");
    });

    deepgramWs.on("message", async (msg) => {
      const data = JSON.parse(msg.toString());

      // Handle VAD speech started
      if (data.type === "SpeechStarted" && isSpeaking) {
        console.log("🛑 Caller interrupted — stopping playback");
        isSpeaking = false;
        clearTimeout(utteranceTimer);
        return;
      }

      // Handle transcript
      if (data.type === "Results") {
        const transcript =
          data.channel?.alternatives?.[0]?.transcript || "";
        const isFinal = data.is_final;
        const speechFinal = data.speech_final;

        if (transcript.trim() === "") return;

        if (isFinal) {
          currentUtterance += " " + transcript;
          currentUtterance = currentUtterance.trim();
          console.log(`👤 Caller: ${currentUtterance}`);
        }

        // When Deepgram signals end of utterance, send to Claude
        if (speechFinal && currentUtterance.trim() !== "") {
          const utteranceToProcess = currentUtterance.trim();
          currentUtterance = "";
          clearTimeout(utteranceTimer);
          await getEmmaResponse(utteranceToProcess);
        }
      }

      // Fallback: UtteranceEnd event
      if (data.type === "UtteranceEnd" && currentUtterance.trim() !== "") {
        const utteranceToProcess = currentUtterance.trim();
        currentUtterance = "";
        clearTimeout(utteranceTimer);
        await getEmmaResponse(utteranceToProcess);
      }
    });

    deepgramWs.on("error", (err) => {
      console.error("Deepgram error:", err.message);
    });

    deepgramWs.on("close", () => {
      console.log("🎤 Deepgram closed");
    });
  }

  // ---------- Get Emma's response from Claude ----------
  async function getEmmaResponse(userText) {
  if (isSpeaking || isProcessing) return;
  isProcessing = true; // Don't respond if already speaking

    console.log(`🧠 Sending to Claude: "${userText}"`);

    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userText,
    });

    try {
      // Call Claude with Emma's full prompt and conversation history
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        temperature: 0,
system: EMMA_PROMPT + "\n\nIMPORTANT: If you do not receive a response to a question, ask it only once more in a different way. Never repeat the exact same question more than once. When collecting an email address, ask the caller to say it naturally, confirm what you heard by reading it back once, and ask if that is correct. When offering appointment times, simply state the available options and stop — do not follow up with phrases like 'which one works best for you' or any similar redundant question. Just wait for the caller to choose.",
        messages: conversationHistory,
      });

      const emmaReply =
        response.content[0]?.text || "I'm sorry, could you repeat that?";

      console.log(`🤖 Emma: ${emmaReply}`);

      // Add Emma's response to history (keeps conversation context)
      conversationHistory.push({
        role: "assistant",
        content: emmaReply,
      });

      // Keep conversation history manageable (last 20 turns)
      if (conversationHistory.length > 40) {
        conversationHistory = conversationHistory.slice(-40);
      }

      // Send Emma's response to ElevenLabs and stream back to caller
   await speakResponse(emmaReply);
  } catch (err) {
    console.error("Claude error:", err.message);
  } finally {
    isProcessing = false;
  }
}

  // ---------- ElevenLabs TTS -> Twilio ----------
  async function speakResponse(text) {
    if (!streamSid) {
      console.warn("No streamSid yet — cannot send audio");
      return;
    }

    isSpeaking = true;

    try {
     const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream?output_format=ulaw_8000`,
  {
    method: "POST",
   headers: {
  "xi-api-key": process.env.ELEVENLABS_API_KEY,
  "Content-Type": "application/json",
  Accept: "audio/basic",
  "Accept-Encoding": "identity",
},
    body: JSON.stringify({
      text: text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 0.9,
      },
      output_format: "ulaw_8000",  // ✅ Stays here, unchanged
    }),
  }
);

      if (!response.ok) {
  const errText = await response.text();
  console.error("ElevenLabs error:", errText);
  isSpeaking = false;
  return;
}

console.log("✅ ElevenLabs response headers:", JSON.stringify(Object.fromEntries(response.headers)));

      // Stream audio chunks directly to Twilio as they arrive
 let buffer = Buffer.alloc(0);
const CHUNK_SIZE = 640;

for await (const chunk of response.body) {
  if (!isSpeaking) break;
  buffer = Buffer.concat([buffer, chunk]);
  while (buffer.length >= CHUNK_SIZE) {
    const toSend = buffer.slice(0, CHUNK_SIZE);
    buffer = buffer.slice(CHUNK_SIZE);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          event: "media",
          streamSid: streamSid,
          media: {
            payload: toSend.toString("base64"),
          },
        })
      );
    }
  }
}
// Send any remaining audio
if (buffer.length > 0 && isSpeaking && ws.readyState === WebSocket.OPEN) {
  ws.send(
    JSON.stringify({
      event: "media",
      streamSid: streamSid,
      media: {
        payload: buffer.toString("base64"),
      },
    })
  );
}

      isSpeaking = false;
    } catch (err) {
      console.error("ElevenLabs stream error:", err.message);
      isSpeaking = false;
    }
  }

  // ---------- Emma's greeting ----------
 async function sendGreeting() {
  await new Promise((r) => setTimeout(r, 1000));
  const greeting = "Hello, thank you for calling TradesMagic, this is Emma. How can I help you today?";
  console.log(`🤖 Emma (greeting): ${greeting}`);
  conversationHistory.push({ role: "assistant", content: greeting });
  await speakResponse(greeting);
  // Don't listen until greeting is fully done
  await new Promise((r) => setTimeout(r, 500));
  isSpeaking = false;
}

  // ---------- Handle Twilio media stream events ----------
  ws.on("message", async (msg) => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch {
      return;
    }

    switch (data.event) {
      case "connected":
        console.log("✅ Twilio stream connected");
        connectDeepgram();
        break;

      case "start":
        streamSid = data.start?.streamSid || data.streamSid;
        console.log(`🚀 Stream started — SID: ${streamSid}`);
        sendGreeting();
        break;

    case "media":
  // Only forward audio to Deepgram when Emma is NOT speaking
  if (!isSpeaking && deepgramWs?.readyState === WebSocket.OPEN) {
    const audioBuffer = Buffer.from(data.media.payload, "base64");
    deepgramWs.send(audioBuffer);
  }
  break;

      case "stop":
        console.log("🛑 Stream stopped");
        isSpeaking = false;
        isProcessing = false;
        deepgramWs?.close();
        break;
    }
  });

  ws.on("close", () => {
    console.log("❌ Call ended");
    isSpeaking = false;
    isProcessing = false;
    deepgramWs?.close();
    conversationHistory = [];
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
});

// ---------- Start server ----------
const PORT = process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Emma voice server running on port " + PORT);
});