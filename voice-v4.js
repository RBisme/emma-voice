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

const { startRuntime } =
    require("./OBM/runtime/obm-runtime-engine");

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

// Temporary Twilio diagnostics: metadata only; never gate or rewrite traffic.
const diagnosticStarted = process.hrtime.bigint();
const connectionId = require("crypto").randomUUID();
let diagnosticSequence = 0, outboundSequence = 0, mediaCount = 0;
let callSid = null, streamSid = null, lastInboundEvent = null;
let lastInboundAt = null, lastMediaAt = null;
const diagnosticText = value => typeof value === "string" ? value.slice(0, 128) : null;
function diagnosticLog(kind, metadata = {}) {
    try {
        console.log("TWILIO_DIAG", JSON.stringify({
            connectionId, callSid, streamSid, kind,
            sequence: ++diagnosticSequence,
            timestamp: new Date().toISOString(),
            elapsedMs: Number(process.hrtime.bigint() - diagnosticStarted) / 1e6,
            ...metadata
        }));
    } catch (_) { /* Diagnostics must not affect the call. */ }
}
function diagnosticError(error) {
    try {
        return {
            name: diagnosticText(error?.name), code: diagnosticText(error?.code),
            message: diagnosticText(error?.message)
        };
    } catch (_) { return { name: "unavailable" }; }
}
const originalSend = ws.send;
ws.send = function (...args) {
    const messageNumber = ++outboundSequence;
    try {
        const [data, options] = args;
        const metadata = {
            messageNumber,
            representation: typeof data === "string" ? "string" : Buffer.isBuffer(data) ? "Buffer" : typeof data,
            readyState: this.readyState, bufferedAmount: this.bufferedAmount,
            options: {}, validJson: false, object: false, violations: []
        };
        for (const key of ["binary", "mask", "fin", "compress"]) {
            if (options && typeof options === "object" && key in options) {
                metadata.options[key] = typeof options[key] === "boolean" ? options[key] : "invalid_type";
            }
        }
        let parsed;
        if (typeof data === "string" || Buffer.isBuffer(data)) {
            metadata.byteLength = Buffer.byteLength(data);
            try { parsed = JSON.parse(data.toString()); metadata.validJson = true; }
            catch (_) { metadata.violations.push("invalid_json"); }
        } else {
            metadata.violations.push("unexpected_representation");
        }
        metadata.object = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
        if (metadata.validJson && !metadata.object) metadata.violations.push("not_object");
        if (metadata.object) {
            metadata.event = diagnosticText(parsed.event);
            metadata.messageStreamSid = diagnosticText(parsed.streamSid);
            metadata.streamSidMatches = streamSid === null ? null : parsed.streamSid === streamSid;
            if (typeof parsed.streamSid !== "string" || !parsed.streamSid) metadata.violations.push("missing_stream_sid");
            if (metadata.streamSidMatches === false) metadata.violations.push("stream_sid_mismatch");
            if (!["media", "mark", "clear"].includes(parsed.event)) metadata.violations.push("unexpected_event");
            if (parsed.event === "media") {
                const payload = parsed.media?.payload;
                metadata.payloadType = typeof payload;
                metadata.payloadLength = typeof payload === "string" ? payload.length : null;
                metadata.validBase64 = typeof payload === "string" && payload.length > 0 &&
                    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(payload);
                metadata.decodedByteLength = metadata.validBase64 ? Buffer.byteLength(payload, "base64") : null;
                if (!metadata.validBase64) metadata.violations.push("invalid_media_payload");
            }
            if (parsed.event === "mark") {
                metadata.markName = diagnosticText(parsed.mark?.name);
                if (typeof parsed.mark?.name !== "string" || !parsed.mark.name) metadata.violations.push("invalid_mark_name");
            }
        }
        metadata.expectedStructure = metadata.validJson && metadata.object && metadata.violations.length === 0;
        diagnosticLog("send_attempt", metadata);
    } catch (_) {
        diagnosticLog("send_attempt", { messageNumber, metadataUnavailable: true });
    }
    try {
        const result = Reflect.apply(originalSend, this, args);
        diagnosticLog("send_returned", { messageNumber });
        return result;
    } catch (error) {
        diagnosticLog("send_threw", { messageNumber, error: diagnosticError(error) });
        throw error;
    }
};

console.log("***** V4 HOST ACCEPTED CALL *****");

ws.on("message", async message => {

let data;

try {

    data = JSON.parse(message.toString());

data = JSON.parse(message.toString());

try {
    lastInboundEvent = diagnosticText(data.event);
    lastInboundAt = new Date().toISOString();
    if (data.event === "start") {
        callSid = diagnosticText(data.start?.callSid);
        streamSid = diagnosticText(data.start?.streamSid);
        diagnosticLog("inbound_start", { inboundSequence: diagnosticText(data.sequenceNumber) });
    } else if (data.event === "media") {
        mediaCount++;
        lastMediaAt = lastInboundAt;
    } else if (data.event === "mark" || data.event === "stop") {
        diagnosticLog("inbound_" + data.event, {
            inboundSequence: diagnosticText(data.sequenceNumber),
            messageStreamSid: diagnosticText(data.streamSid),
            markName: diagnosticText(data.mark?.name), mediaCount, lastMediaAt
        });
    }
} catch (_) { /* Diagnostics must not affect inbound processing. */ }

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
    runtime.session.connected &&
    runtime.session.configured
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

ws.on("close", (code, reason) => {

try {
    diagnosticLog("socket_close", {
        code, reason: Buffer.isBuffer(reason) ? reason.toString("utf8") : diagnosticText(reason),
        lastOutboundMessage: outboundSequence, lastInboundEvent, lastInboundAt,
        mediaCount, lastMediaAt
    });
} catch (_) { /* Preserve existing close handling. */ }

    console.log("❌ Call ended");

});

ws.on("error", err => {

diagnosticLog("socket_error", { error: diagnosticError(err), lastOutboundMessage: outboundSequence });

    console.error(err);

});

const twilioStream =
    new TwilioMediaStream(ws);

const businessRuntime =
    startRuntime(
        "./OBM/StanleySteemer_Marlborough__BUSINESS_MANIFEST_v1.md"
    );

businessRuntime.websocket = ws;
businessRuntime.twilioStream = twilioStream;

const runtime =
    createLiveVoiceRuntime(
        businessRuntime
    );

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