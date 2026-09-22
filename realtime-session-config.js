/**
 * ============================================================
 * TradesMagic
 * OpenAI Realtime Session Configuration
 * ============================================================
 *
 * Builds the session.update payload sent to OpenAI
 * Realtime.
 *
 * This module owns ONLY session configuration.
 *
 * ============================================================
 */

function buildSessionConfig(prompt, voice) {

    return {

        type: "session.update",

session: {
            type: "realtime",
            output_modalities: ["text"],
            instructions: prompt,
            tools: [{
                type: "function",
                name: "review_open_tasks",
                description: "Retrieve existing open work, jobs, or tasks. Call this before answering requests to inspect open work, including open water damage or flood jobs. This is read-only and does not create tasks. Answer conversationally using only returned data; do not invent missing details. An empty successful result means no open tasks. If retrieval fails, explain that open work could not be retrieved, not that there are no tasks.",
                parameters: {
                    type: "object",
                    properties: {},
                    required: [],
                    additionalProperties: false
                }
            }],
            audio: {
                input: {
                    format: {
                        type: "audio/pcmu"
                    },

transcription: {
    model: "gpt-4o-mini-transcribe"
},
                    turn_detection: {
                        type: "server_vad",
                        threshold: 0.75,
                        prefix_padding_ms: 300,
                        silence_duration_ms: 1000
                    }
                }
            }
        }
    };

}

function configureRealtimeSession(session) {

const config = buildSessionConfig(
    session.prompt || "",
    session.voice
);

    session.send(config);

}

module.exports = {

    buildSessionConfig,

    configureRealtimeSession

};