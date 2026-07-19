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

    responseManager,

    twilioStream,

    openAIClient,

    triggerMap = {}

}) {

  console.log("====================================");
    console.log("VOICE V3 BOOTSTRAP");
    console.log("====================================");

    const controlLayer = new VoiceControlLayer();

    const provider = new OpenAIIntentProvider(openAIClient);

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
    voiceRuntime
);

return voiceRuntime;

}

module.exports = {

    createVoiceV3

};