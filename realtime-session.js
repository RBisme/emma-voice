/**
 * ============================================================
 * TradesMagic
 * OpenAI Realtime Session
 * ============================================================
 *
 * Owns the lifecycle of the OpenAI Realtime session.
 *
 * Responsibilities:
 *
 * • Connect to OpenAI Realtime
 * • Configure session
 * • Send session updates
 * • Send response requests
 * • Receive OpenAI events
 * • Notify subscribers
 *
 * Does NOT:
 *
 * • Talk to Twilio
 * • Stream audio
 * • Execute Runtime
 * • Generate speech
 *
 * ============================================================
 */

const WebSocket = require("ws");

const fs = require("fs");
const path = require("path");

const {
    configureRealtimeSession
} = require("./realtime-session-config");

class RealtimeSession {

    constructor({ apiKey, model, prompt }) {

    this.apiKey = apiKey;

    this.model = model;

        this.ws = null;

        this.connected = false;

        this.listeners = [];

this.prompt = prompt || "";

    }

async connect() {

    return await new Promise((resolve, reject) => {

        this.ws = new WebSocket(

            `wss://api.openai.com/v1/realtime?model=${this.model}`,

            {

                headers: {

                    Authorization:
                        "Bearer " + this.apiKey

                }

            }

        );

        this.ws.on("open", () => {

            this.connected = true;

            console.log(
                "✅ OpenAI Realtime Connected"
            );

console.log(
    "OpenAI readyState:",
    this.ws.readyState,
    "OPEN constant:",
    WebSocket.OPEN
);

console.log("PROMPT BEFORE SESSION.UPDATE:");
console.log(this.prompt);

if (this.prompt) {

    configureRealtimeSession(this);

}
else {

    console.log(
        "Skipping initial session.update (no prompt yet)."
    );

}

resolve();

        });

        this.ws.on("error", reject);

        this.ws.on("close", () => {

            this.connected = false;

            console.log(
                "❌ OpenAI Realtime Disconnected"
            );

        });

        this.ws.on("message", (data) => {

            const event =
                JSON.parse(data.toString());

console.log(
    "OPENAI EVENT TYPE:",
    event.type
);

fs.appendFileSync(

    path.join(
        __dirname,
        "openai-events.log"
    ),

    JSON.stringify(
        event,
        null,
        2
    ) + "\r\n====================================\r\n"

);

// console.log(
//     "OPENAI EVENT:",
//     event
// );

if (event.type === "session.updated") {

    console.log(
        "SESSION UPDATED EVENT:",
        JSON.stringify(event, null, 2)
    );

    console.log(
        "SESSION INSTRUCTIONS:",
        event.session.instructions
    );

}

            this.listeners.forEach(listener => {

                listener(event);

            });

        });

    });

}
    
   updateProfile(prompt, voice) {

    this.prompt = prompt;

    this.voice = voice;

    configureRealtimeSession(this);

}

onEvent(listener) {

        this.listeners.push(listener);

    }

offEvent(listener) {

    this.listeners =
        this.listeners.filter(
            item => item !== listener
        );

}

      send(message) {

        if (!this.connected) {

            throw new Error(
                "Realtime session is not connected."
            );

        }

// console.log(
//     "send() readyState:",
//     this.ws.readyState
// );

if (message.type !== "input_audio_buffer.append") {

    console.log(
        "OUTGOING OPENAI:",
        JSON.stringify(message, null, 2)
    );

}

this.ws.send(
    JSON.stringify(message)
);

    }

    sendAudio(payload) {


// console.log(
//    "APPENDING AUDIO:",
//    payload ? payload.length : 0
// );

        this.send({

            type: "input_audio_buffer.append",

            audio: payload

        });

    }

commitAudio() {

console.log("COMMIT AUDIO");

    this.send({

        type: "input_audio_buffer.commit"

    });

}


}


module.exports = {

    RealtimeSession

};