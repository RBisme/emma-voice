/**
 * ============================================================
 * TradesMagic
 * Voice Runtime Startup
 * ============================================================
 *
 * Owns production startup of Voice V3.
 *
 * Responsibilities:
 *
 * • Connect OpenAI Realtime
 * • Register production handlers
 * • Configure session
 * • Start Voice Runtime
 *
 * Owns NO business logic.
 * ============================================================
 */

const {
    buildSessionConfig
} = require("./realtime-session-config");

function startVoiceRuntime(runtime, prompt) {

    const {

        voice

    } = runtime;

    const {

        session,

        eventHandler

    } = voice;

    eventHandler.register(

        "session.created",

        () => {

            session.send(

                buildSessionConfig(
    prompt
)

            );

        }

    );

    session.connect();

}

module.exports = {

    startVoiceRuntime

};