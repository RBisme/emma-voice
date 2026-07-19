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

    constructor({ apiKey, model }) {

        this.apiKey = apiKey;

        this.model = model;

        this.ws = null;

        this.connected = false;

        this.listeners = [];

        this.prompt = fs.readFileSync(

    path.join(__dirname, "emma_sales_prompt.txt"),

    "utf8"

);

console.log(this.prompt);

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

configureRealtimeSession(this);

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
    "OPENAI EVENT:",
    event
);

if (event.type === "session.updated") {

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
    onEvent(listener) {

        this.listeners.push(listener);

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

        this.ws.send(
            JSON.stringify(message)
        );

    }

    sendAudio(payload) {

console.log(
    "APPENDING AUDIO:",
    payload ? payload.length : 0
);

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