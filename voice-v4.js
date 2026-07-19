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

const {
    TwilioMediaStream
} = require("./twilio-media-stream");

const server = http.createServer((req, res) => {

console.log("HTTP:", req.method, req.url);

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

console.log("***** V4 HOST ACCEPTED CALL *****");

ws.on("message", async message => {

let data;

try {

    data = JSON.parse(message.toString());

// console.log(
//     "RAW TWILIO:",
//     message.toString()
// );

if (data.event !== "media") {

/*   
 console.log(
        "TWILIO EVENT:",
        data.event
    );
*/

}


} catch {

    return;

}

if (!data.event) {

    return;

}

    switch (data.event) {

case "connected":

    await runtime.connected(data);
    break;

case "start":

    await runtime.started(data);

    runtime.twilioStream.setStreamSid(
        data.start.streamSid
    );

setTimeout(() => {

    console.log("TIMEOUT FIRED");

    console.log(
        "CONNECTED:",
        runtime.session?.connected
    );

    if (
        !runtime.session ||
        !runtime.session.connected
    ) {

        console.log("RETURNING EARLY");

        return;

    }

    console.log("CALLING createResponse");

    runtime.responseManager.createResponse(
    runtime.session.prompt
);

}, 500);

    break;

case "media":

    if (
        runtime.session &&
        runtime.session.connected
    ) {

      runtime.session.sendAudio(
    data.media.payload
);

// runtime.session.commitAudio();

    }

    break;

case "stop":

    await runtime.stop();
    break;
}

});


    console.log("📞 Call connected");

/*
console.log(
    "Client:",
    request.socket.remoteAddress
);

*/

/*
console.log(
    "Path:",
    request.url
);

*/

ws.on("close", () => {

    console.log("❌ Call ended");

});

ws.on("error", err => {

    console.error(err);

});

const twilioStream =
    new TwilioMediaStream(ws);

 const runtime =
    createLiveVoiceRuntime({
        websocket: ws,
        twilioStream
    });

await runtime.connected(ws);

await runtime.start();

/*
console.log(
    "Voice Runtime Ready"
);

*/


/*
console.log(
    "Waiting for Twilio events..."
);


*/

});

const PORT =
    process.env.PORT || 3004;

server.listen(PORT, () => {

    console.log(
        `Voice V4 running on ${PORT}`
    );

});