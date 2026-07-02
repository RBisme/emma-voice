/**
 * ============================================================
 * TM Voice V3
 * Speech Qualifier
 * ------------------------------------------------------------
 * Determines whether incoming speech should be accepted by
 * the Voice Control Layer.
 *
 * Responsibilities:
 *   - Speech qualification
 *   - Noise rejection
 *   - Silence detection
 *   - Confidence threshold evaluation
 *
 * Vendor Agnostic
 * Runtime Agnostic
 * ============================================================
 */

class VoiceSpeechQualifier {

    constructor(config = {}) {

        this.minimumConfidence = config.minimumConfidence ?? 0.70;
        this.minimumLength = config.minimumLength ?? 2;

    }

    qualify(result = {}) {

        const transcript = (result.transcript || "").trim();
        const confidence = result.confidence ?? 1.0;

        if (transcript.length < this.minimumLength) {

            return {
                accepted: false,
                reason: "TRANSCRIPT_TOO_SHORT"
            };

        }

        if (confidence < this.minimumConfidence) {

            return {
                accepted: false,
                reason: "LOW_CONFIDENCE"
            };

        }

        return {
            accepted: true,
            transcript,
            confidence
        };

    }

}

module.exports = {

    VoiceSpeechQualifier

};