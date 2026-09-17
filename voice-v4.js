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

const fs = require("fs");
const path = require("path");
const personaMap = require("./persona-map");

const createLiveVoiceRuntime =
    require("./live-voice-runtime");

const {
    TwilioMediaStream
} = require("./twilio-media-stream");

const server = http.createServer((req, res) => {

let body = "";

req.on("data", chunk => {

    body += chunk;

});

req.on("end", () => {

    req.body = Object.fromEntries(

        new URLSearchParams(body)

    );

    handleRequest();

});

function handleRequest() {

console.log("HTTP:", req.method, req.url);

console.log("HEADERS:", req.headers);

console.log("BODY:", req.body);

    if (
        req.method === "POST" &&
        req.url === "/voice"
    ) {

const calledNumber =
    req.body.Called || "";

console.log(
    "CALLED NUMBER:",
    calledNumber
);

res.writeHead(200, {

    "Content-Type": "text/xml"

});

res.end(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Connect>
        <Stream url="wss://${req.headers.host}/voice">
            <Parameter
                name="calledNumber"
                value="${calledNumber}" />
        </Stream>
    </Connect>
</Response>`);

return;

    }

    res.writeHead(200);

    res.end("Voice V4 running");
}
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

data = JSON.parse(message.toString());

if (data.event === "start") {

    console.log(
        "\n===== TWILIO START EVENT =====\n"
    );

    console.log(
        JSON.stringify(data, null, 2)
    );

    console.log(
        "\n==============================\n"
    );

}

 // console.log(
 //    "RAW TWILIO:",
 //    message.toString()
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

    runtime.twilioStream.setStreamSid(
        data.start.streamSid
    );

    const calledNumber =
        data.start.customParameters?.calledNumber;

    const persona =
        personaMap[calledNumber];

    console.log(
        "CALLED NUMBER:",
        calledNumber
    );

    console.log(
        "PERSONA:",
        persona
            ? persona.promptFile
            : "Default Emma"
    );

    const waitForSession = setInterval(() => {

        if (
            !runtime.session ||
            !runtime.session.connected
        ) {


            return;
        }

        clearInterval(waitForSession);

       if (persona) {

console.log("STEP 1 - activatePersona()");

runtime.activatePersona(
    persona,
    false
);


}
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

    }

    break;

case "mark":

    console.log(
        "TWILIO MARK:",
        data.mark.name
    );

    twilioStream.receiveMark(
        data.mark.name
    );

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