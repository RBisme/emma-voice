/**
 * ============================================================
 * TradesMagic
 * Voice V4 Host
 * ============================================================
 *
 * Responsibilities
 *
 * • Accept Twilio WebSocket connections
 * • Start Voice Runtime
 * • Connect OpenAI Realtime
 * • Route audio
 *
 * Owns NO:
 *
 * • Deepgram
 * • Claude
 * • ElevenLabs
 * • Business logic
 * • Intent extraction
 *
 * ============================================================
 */

const http = require("http");
const WebSocket = require("ws");

const createLiveVoiceRuntime =
    require("./live-voice-runtime");

const server = http.createServer((req, res) => {

    if (
        req.method === "POST" &&
        req.url === "/voice"
    ) {

        res.writeHead(200, {

            "Content-Type": "text/xml"

        });

        res.end(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Connect>
        <Stream url="wss://${req.headers.host}/voice" />
    </Connect>
</Response>`);

        return;

    }

    res.writeHead(200);

    res.end("Voice V4 running");

});


const wss = new WebSocket.Server({

    server,
    path: "/voice"

});

wss.on("connection", async (ws, request) => {

    console.log("📞 Call connected");

console.log(
    "Client:",
    request.socket.remoteAddress
);

console.log(
    "Path:",
    request.url
);

ws.on("close", () => {

    console.log("❌ Call ended");

});

ws.on("error", err => {

    console.error(err);

});

  const runtime =
    createLiveVoiceRuntime({

        websocket: ws

    });

await runtime.connected(ws);

await runtime.start();

console.log(
    "Voice Runtime Ready"
);

console.log(
    "Waiting for Twilio events..."
);

ws.on("message", async message => {

let data;

try {

    data = JSON.parse(message.toString());

} catch {

    return;

}

if (!data.event) {

    return;

}

    switch (data.event) {

case "connected":
case "start":
case "media":

    await runtime.processEvent(data);
    break;

    case "stop":

        await runtime.stop();
        break;

}

});

});

const PORT =
    process.env.PORT || 3004;

server.listen(PORT, () => {

    console.log(
        `Voice V4 running on ${PORT}`
    );

});