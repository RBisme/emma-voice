require("dotenv").config({ path: "./emma-realtime-v2.env" });

console.log("USING THIS REALTIME-SERVER");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const ffmpegPath = require("ffmpeg-static");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const createLiveVoiceRuntime =
  require("C:/TM/emma-deploy/live-voice-runtime");

const { startRuntime } =
  require("C:/TM/OBM/runtime/obm-runtime-engine");

const IDENTITY =
  require("C:/TM/core/TM_CORE_IDENTITY_KERNEL");

console.log("IDENTITY:", IDENTITY.SYSTEM_IDENTITY);

const fetch = global.fetch;

function getEmmaPrompt() {
  return fs.readFileSync(
    path.join("C:\\TM\\brain", "emma_realtime_sales_prompt_v2.txt"),
    "utf8"
  );
}

const app = express();

app.get("/", (req, res) => {
  res.send("Emma Realtime V2 Running");
});

app.post("/voice", (req, res) => {
  const twiml =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
    "<Response>" +
    "<Connect>" +
    "<Stream url=\"wss://abundant-stillness-production-e590.up.railway.app/stream\" />" +
    "</Connect>" +
    "<Pause length=\"60\" />" +
    "</Response>";

  res.type("text/xml");
  res.send(twiml);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


// 👇 ADD THIS HERE (UNDER BOTH LINES)
app.post("/voice", (req, res) => {
  const twiml =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
    "<Response>" +
    "<Connect>" +
    "<Stream url=\"wss://abundant-stillness-production-e590.up.railway.app/stream\" />" +
    "</Connect>" +
    "<Pause length=\"60\" />" +
    "</Response>";

  res.type("text/xml");
  res.send(twiml);
});

wss.on("connection", (ws) => {
  console.log("🔌 Twilio connected");

const runtime = {};
const voiceRuntime = createLiveVoiceRuntime(runtime);

  let streamSid = null;
  let openAiReady = false;
  let sessionConfigured = false;
  let currentTranscript = "";

  const ffmpeg = spawn(ffmpegPath, [
    "-f", "s16le",
    "-ar", "24000",
    "-ac", "1",
    "-i", "pipe:0",
    "-f", "mulaw",
    "-ar", "8000",
    "-ac", "1",
    "pipe:1"
  ]);

  const openAiWs = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-realtime",
    {
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY
      }
    }
  );

  openAiWs.on("open", () => {
    console.log("✅ OpenAI connected");
    openAiReady = true;

    openAiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        instructions:
          IDENTITY.CORE_POSITIONING + "\n\n" + getEmmaPrompt(),
        audio: {
          input: {
            format: { type: "audio/pcmu" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.75,
              prefix_padding_ms: 300,
              silence_duration_ms: 900
            }
          },
          output: {
            format: { type: "audio/pcm", rate: 24000 },
            voice: "sage"
          }
        }
      }
    }));
  });

  openAiWs.on("message", async (data) => {
    const response = JSON.parse(data.toString());

    if (response.type === "response.output_audio_transcript.delta") {
  currentTranscript += response.delta;
  process.stdout.write(response.delta);
}

if (response.type === "response.done") {
  if (currentTranscript.length > 0) {
    speakResponse(currentTranscript);
    currentTranscript = "";
  }
}

    
   if (response.type === "session.updated") {
  sessionConfigured = true;
  console.log("SESSION OK");
}
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.event === "start") {
      streamSid = data.start.streamSid;

      setTimeout(() => {
        if (!openAiReady || !sessionConfigured) return;

        openAiWs.send(JSON.stringify({
          type: "response.create",
          response: {
            instructions:
              IDENTITY.CORE_POSITIONING + "\n\n" + getEmmaPrompt()
          }
        }));
      }, 800);
    }

    if (data.event === "media" && openAiReady) {
      openAiWs.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio: data.media.payload
      }));
    }
  });

  async function speakResponse(text) {
    if (!streamSid) return;

    console.log("🎤 ElevenLabs:", text);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream?output_format=ulaw_8000`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5"
        })
      }
    );

    if (!response.ok) return;

    let buffer = Buffer.alloc(0);
    const CHUNK_SIZE = 640;

    for await (const chunk of response.body) {
      buffer = Buffer.concat([buffer, chunk]);

      while (buffer.length >= CHUNK_SIZE) {
        const out = buffer.slice(0, CHUNK_SIZE);
        buffer = buffer.slice(CHUNK_SIZE);

        ws.send(JSON.stringify({
          event: "media",
          streamSid,
          media: { payload: out.toString("base64") }
        }));
      }
    }
  }

  ws.on("close", () => {
    console.log("❌ Twilio disconnected");
  });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log("🚀 Running on port", PORT);
});