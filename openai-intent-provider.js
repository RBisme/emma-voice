const { VoiceIntentProvider } = require("./voice-intent-provider");
const { resolveTrigger } = require("./OBM/runtime/voice-trigger-resolver");

class OpenAIIntentProvider extends VoiceIntentProvider {

    constructor(client, deployment) {
        super();

        if (!client) {
            throw new Error("OpenAI client is required.");
        }

        if (!deployment) {
            throw new Error("Deployment is required.");
        }

        this.client = client;
        this.deployment = deployment;
    }

    async extractIntent(transcript) {

        if (!transcript || transcript.trim() === "") {
            throw new Error("Transcript is required.");
        }

        const result = resolveTrigger(
            transcript,
            this.deployment
        );

        return {
            name: result.trigger,
            confidence: result.confidence,
            transcript
        };
    }
}

module.exports = {
    OpenAIIntentProvider
};