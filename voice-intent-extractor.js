/**
 * ============================================================
 * TM Voice V3
 * Voice Intent Extractor
 * ------------------------------------------------------------
 * Extracts normalized operational intent from qualified speech.
 *
 * Responsibilities:
 *   - Accept qualified transcript
 *   - Request normalized operational intent
 *   - Validate intent response
 *   - Return standardized intent object
 *
 * This component will ultimately communicate with OpenAI
 * Realtime.
 *
 * It intentionally knows nothing about:
 *
 *   - OBM Runtime
 *   - Workflows
 *   - Tasks
 *   - Deployments
 *
 * ============================================================
 */

class VoiceIntentExtractor {

    constructor(provider = null) {

        this.provider = provider;

    }

    async extract(transcript) {

        if (!transcript || transcript.trim() === "") {

            throw new Error("Transcript is required.");

        }

        if (!this.provider) {

            throw new Error(
                "No intent provider configured."
            );

        }

        return await this.provider.extractIntent(transcript);

    }

}

module.exports = {

    VoiceIntentExtractor

};