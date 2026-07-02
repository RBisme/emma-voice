/**
 * ============================================================
 * TM Voice V3
 * Voice Intent Provider
 * ------------------------------------------------------------
 * Abstract interface for extracting operational intent.
 *
 * Responsibilities:
 *   - Accept qualified transcript
 *   - Return normalized operational intent
 *
 * This interface allows Voice V3 to support different
 * AI providers without changing the Voice Control Layer.
 * ============================================================
 */

class VoiceIntentProvider {

    async extractIntent(transcript) {

        throw new Error(
            "extractIntent() must be implemented by the provider."
        );

    }

}

module.exports = {

    VoiceIntentProvider

};