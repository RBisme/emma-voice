/**
 * ============================================================
 * TradesMagic
 * Voice V3 Bootstrap
 * ============================================================
 *
 * Creates and wires together the Voice V3 runtime.
 *
 * Responsibilities:
 *   - Create Voice Control Layer
 *   - Create Intent Provider
 *   - Create Intent Extractor
 *   - Create Trigger Resolver
 *   - Create Runtime Bridge
 *   - Create Runtime Pipeline
 *
 * No Twilio.
 * No OpenAI session.
 * No business logic.
 * ============================================================
 */

const { VoiceControlLayer } = require("./voice-control-layer");
const { VoiceIntentExtractor } = require("./voice-intent-extractor");
const { VoiceTriggerResolver } = require("./voice-trigger-resolver");
const { VoiceRuntimeBridge } = require("./voice-runtime-bridge");
const { VoiceRuntimePipeline } = require("./voice-runtime-pipeline");
const { OpenAIIntentProvider } = require("./openai-intent-provider");

const { RealtimeSession } =
require("./realtime-session");

const { RealtimeEventHandler } =
require("./realtime-event-handler");

const { RealtimeTranscriptHandler } =
require("./realtime-transcript-handler");

const { RealtimeAudioHandler } =
require("./realtime-audio-handler");

const { RealtimeResponseManager } =
require("./realtime-response-manager");

const { VoiceRuntime } =
require("./voice-runtime");

const { assembleVoiceRuntime } =
require("./voice-runtime-assembler");


function createVoiceV3({

    runtime,

    session,

    eventHandler,

    transcriptHandler,

    audioHandler,

    elevenLabsStreamer,

    runtimeAudioPlayer,

    responseManager,

    twilioStream,

    openAIClient,

    triggerMap = {}

}) {

  console.log("====================================");
    console.log("VOICE V3 BOOTSTRAP");
    console.log("====================================");

    const controlLayer = new VoiceControlLayer();

    const provider = new OpenAIIntentProvider(openAIClient, runtime);

    const extractor = new VoiceIntentExtractor(provider);

    const resolver = new VoiceTriggerResolver(triggerMap);

    const bridge = new VoiceRuntimeBridge();

    const pipeline = new VoiceRuntimePipeline({

        qualifier: controlLayer.qualifier,

        intentExtractor: extractor,

        triggerResolver: resolver,

        runtimeBridge: bridge

    });

   
   const voiceRuntime =
    new VoiceRuntime({

        session,

        responseManager,

        eventHandler,

        transcriptHandler,

        audioHandler,

        elevenLabsStreamer,

        runtimeAudioPlayer,

        twilioStream,

        pipeline,

        controlLayer,

        extractor,

        resolver,

        bridge,

    });

    assembleVoiceRuntime(
        voiceRuntime
    );

bridge.attachRuntime(
    runtime
);

    const completedReviewCalls = new Set();

    eventHandler.register("response.done", async event => {
        if (event.response?.status !== "completed") {
            return;
        }

        let reviewReturned = false;
        for (const item of event.response.output || []) {
            if (item.type !== "function_call" ||
                item.name !== "review_open_tasks" ||
                !item.call_id || completedReviewCalls.has(item.call_id)) {
                continue;
            }

            completedReviewCalls.add(item.call_id);
            let output;
            try {
                const tasks = await runtime.reviewOpenTasks();
                if (!Array.isArray(tasks)) {
                    throw new Error("Invalid open work result");
                }
                output = JSON.stringify({ success: true, tasks });
            } catch (error) {
                output = JSON.stringify({
                    success: false,
                    error: "Open work could not be retrieved."
                });
            }

            session.send({
                type: "conversation.item.create",
                item: {
                    type: "function_call_output",
                    call_id: item.call_id,
                    output
                }
            });
            reviewReturned = true;
        }

        if (reviewReturned) {
            responseManager.createResponse();
        }
    });

return voiceRuntime;

}

module.exports = {

    createVoiceV3

};