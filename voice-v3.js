/**
 * ============================================================
 * TradesMagic
 * Voice V3 Runtime
 * ============================================================
 *
 * Voice V3 Entry Point
 *
 * Architecture
 *
 * Twilio
 *      ↓
 * OpenAI Realtime
 *      ↓
 * Voice Control Layer
 *      ↓
 * Intent Extraction
 *      ↓
 * Trigger Resolution
 *      ↓
 * Runtime Bridge
 *      ↓
 * OBM Runtime
 *
 * Voice V2 (voice.js) remains untouched.
 * ============================================================
 */

require("dotenv").config({
    path: "C:/TM/brain/.env"
});

const { VoiceControlLayer } = require("./voice-control-layer");
const { VoiceIntentExtractor } = require("./voice-intent-extractor");
const { VoiceTriggerResolver } = require("./voice-trigger-resolver");
const { VoiceRuntimeBridge } = require("./voice-runtime-bridge");
const { OpenAIIntentProvider } = require("./openai-intent-provider");

console.log("====================================");
console.log("TradesMagic Voice V3");
console.log("====================================");
console.log();

console.log("Initializing Voice Control Layer...");

const voiceControl = new VoiceControlLayer();

console.log("Initializing Intent Provider...");

const intentProvider = new OpenAIIntentProvider({});

const intentExtractor =
    new VoiceIntentExtractor(intentProvider);

console.log("Initializing Trigger Resolver...");

const triggerResolver =
    new VoiceTriggerResolver({});

console.log("Voice Runtime ready.");
console.log();

console.log("Next Step:");
console.log("Integrate OpenAI Realtime session.");