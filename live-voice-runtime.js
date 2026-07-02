/**
 * ============================================================
 * TradesMagic
 * Live Voice Runtime
 * ============================================================
 *
 * Production Voice V3 Assembly
 *
 * Wires together the validated Voice V3 components.
 *
 * This file owns no business logic.
 * It performs runtime assembly only.
 * ============================================================
 */

require("dotenv").config({
    path: "C:/TM/brain/.env"
});

const { RealtimeSession } =
require("./realtime-session");


const {
    RealtimeEventHandler
} = require("./realtime-event-handler");

const {
    RealtimeTranscriptHandler
} = require("./realtime-transcript-handler");

const {
    RealtimeResponseManager
} = require("./realtime-response-manager");

const {
    createVoiceV3
} = require("./voice-v3-bootstrap");

module.exports = function createLiveVoiceRuntime(runtime) {

console.log("====================================");
console.log("VOICE V3 BOOTSTRAP");
console.log("====================================");

    const session =
        new RealtimeSession({

            apiKey: process.env.OPENAI_API_KEY,

            model: "gpt-realtime"

        });

    const eventHandler =
        new RealtimeEventHandler();

    const transcriptHandler =
        new RealtimeTranscriptHandler();

    const responseManager =
        new RealtimeResponseManager(session);

    const voice =
        createVoiceV3(

            runtime,

            {},

            {}

        );

voice.start();

return voice;

};

