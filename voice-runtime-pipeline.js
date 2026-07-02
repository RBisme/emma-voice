/**
 * ============================================================
 * TM Voice V3
 * Voice Runtime Pipeline
 * ------------------------------------------------------------
 * Orchestrates the Voice V3 processing pipeline.
 *
 * Pipeline:
 *
 * Speech
 *   ↓
 * Speech Qualification
 *   ↓
 * Intent Extraction
 *   ↓
 * Trigger Resolution
 *   ↓
 * Runtime Bridge
 *
 * This class owns no business logic.
 * It coordinates existing Voice V3 components.
 * ============================================================
 */

class VoiceRuntimePipeline {

    constructor({

        qualifier,

        intentExtractor,

        triggerResolver,

        runtimeBridge

    }) {

        this.qualifier = qualifier;
        this.intentExtractor = intentExtractor;
        this.triggerResolver = triggerResolver;
        this.runtimeBridge = runtimeBridge;

    }

    async process(result) {

        const qualified = this.qualifier.qualify(result);

        if (!qualified.accepted) {

            return {

                success: false,

                stage: "qualification",

                result: qualified

            };

        }

        const intent = await this.intentExtractor.extract(
            qualified.transcript
        );

        const trigger = this.triggerResolver.resolve(intent);

        if (!trigger.matched) {

            return {

                success: false,

                stage: "trigger",

                result: trigger

            };

        }

        const runtimeResult =
            this.runtimeBridge.dispatch({

                type: trigger.trigger,

                transcript: qualified.transcript,

                confidence: trigger.confidence

            });

        return {

            success: true,

            stage: "runtime",

            runtimeResult

        };

    }

}

module.exports = {

    VoiceRuntimePipeline

};