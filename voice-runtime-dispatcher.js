/**
 * ============================================================
 * TradesMagic
 * Voice Runtime Dispatcher
 * ============================================================
 *
 * Central execution engine for the Voice Runtime.
 *
 * Responsibilities:
 *
 * • Accept runtime events
 * • Execute runtime actions
 * • Coordinate response generation
 *
 * Owns NO transport.
 * Owns NO speech recognition.
 * Owns NO OpenAI session.
 * ============================================================
 */

const {
    VoiceBusinessResponseGenerator
} = require("./voice-business-response-generator");



class VoiceRuntimeDispatcher {

constructor(runtime) {

    this.runtime = runtime;

    this.responseGenerator =
        new VoiceBusinessResponseGenerator();

}

async execute(event) {

    if (!event) {
        throw new Error(
            "Runtime event is required."
        );
    }

    const response =
        await this.responseGenerator.generate(
            event
        );

    return {

        success: true,

        event,

        response

    };

}
}

module.exports = {


    VoiceRuntimeDispatcher

};