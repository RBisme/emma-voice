/**
 * ============================================================
 * TM Voice V3
 * OpenAI Intent Provider
 * ------------------------------------------------------------
 * OpenAI implementation of the VoiceIntentProvider interface.
 *
 * Responsibilities:
 *   - Submit qualified transcript
 *   - Receive normalized operational intent
 *   - Validate provider response
 *
 * This is the ONLY Voice V3 component that knows about OpenAI.
 * ============================================================
 */

const { VoiceIntentProvider } = require("./voice-intent-provider");

class OpenAIIntentProvider extends VoiceIntentProvider {

    constructor(client) {

        super();

        if (!client) {
            throw new Error("OpenAI client is required.");
        }

        this.client = client;

    }

    async extractIntent(transcript) {

        if (!transcript || transcript.trim() === "") {
            throw new Error("Transcript is required.");
        }

        //
        // Placeholder.
        //
        // The actual OpenAI Realtime implementation will
        // replace this section during provider integration.
        //

        return {

            name: "UNKNOWN",

            confidence: 0.0,

            transcript

        };

    }

}

module.exports = {

    OpenAIIntentProvider

};