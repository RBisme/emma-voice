/**
 * ============================================================
 * TM Voice V3
 * Voice Trigger Resolver
 * ------------------------------------------------------------
 * Converts normalized operational intents into runtime
 * trigger events.
 *
 * Responsibilities:
 *   - Resolve normalized intents
 *   - Validate supported triggers
 *   - Produce runtime events
 *
 * Business vocabulary belongs to deployments.
 *
 * Vendor Agnostic
 * Runtime Agnostic
 * ============================================================
 */

class VoiceTriggerResolver {

    constructor(triggerMap = {}) {

        this.triggerMap = triggerMap;

    }

    resolve(intent) {

        if (!intent || !intent.name) {

            return {
                matched: false,
                trigger: null
            };

        }

        const trigger = this.triggerMap[intent.name];

        if (!trigger) {

            return {
                matched: false,
                trigger: null
            };

        }

        return {

            matched: true,

            trigger,

            confidence: intent.confidence ?? 1.0,

            transcript: intent.transcript ?? ""

        };

    }

}

module.exports = {

    VoiceTriggerResolver

};