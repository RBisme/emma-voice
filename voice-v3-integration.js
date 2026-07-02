/**
 * ============================================================
 * TradesMagic
 * Voice V3 Integration
 * ============================================================
 *
 * Bridges the production runtime to Voice V3.
 *
 * Responsibilities:
 *
 * • Accept transcript
 * • Execute Voice V3 pipeline
 * • Return pipeline result
 *
 * Owns NO business logic.
 * Owns NO speech generation.
 * Owns NO networking.
 * ============================================================
 */

class VoiceV3Integration {

    constructor(pipeline) {

        this.pipeline = pipeline;

    }

    async process(transcript) {

        return await this.pipeline.process(
            transcript
        );

    }

}

module.exports = {

    VoiceV3Integration

};