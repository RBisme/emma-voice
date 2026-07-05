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

function buildSessionConfig(prompt) {

    return {

        type: "session.update",

        session: {

            type: "realtime",

            instructions: prompt,

            audio: {

                input: {

                    format: {

                        type: "audio/pcmu"

                    },

                    turn_detection: {

                        type: "server_vad",

                        threshold: 0.75,

                        prefix_padding_ms: 300,

                        silence_duration_ms: 1000

                    }

                },

                       output: {

                    format: {

                        type: "audio/pcmu"

                    },

                    voice: "sage"

                }

            }

        }

    };

}

function configureRealtimeSession(session) {

    const config = buildSessionConfig(
    session.prompt || ""
);

    session.send(config);

}

module.exports = {

    buildSessionConfig,

    configureRealtimeSession

};