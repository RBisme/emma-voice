/**
 * ============================================================
 * TradesMagic
 * Persona Transfer Handler
 * ============================================================
 *
 * Responsibilities:
 *
 * • Execute active persona transfers
 * • Validate requested persona
 * • Update the active Realtime profile
 * • Request the first response from the new persona
 *
 * Owns NO:
 *
 * • Business workflow
 * • Conversation logic
 * • Runtime lifecycle
 * • Dispatcher logic
 *
 * ============================================================
 */

class PersonaTransferHandler {

    constructor(runtime) {

    this.runtime = runtime;

}

    async transfer(targetPersona) {

console.log(">>> ENTERED PersonaTransferHandler.transfer()");

        console.log(
            "Persona transfer requested:",
            targetPersona
        );

console.log("TRANSFER STEP A");

        if (!targetPersona) {

            return {

                success: false,

                message:
                    "Target persona is required."

            };

        }

        const personaMap =
            require("./persona-map");

console.log("TARGET PERSONA:", targetPersona);
console.log("AVAILABLE PERSONAS:", Object.keys(personaMap));

        const persona =
            personaMap[targetPersona];

console.log("TRANSFER STEP B");

        if (!persona) {

            return {

                success: false,

                targetPersona,

                message:
                    "Unknown persona."

            };

        }

        const {

            promptFile,

            elevenLabsVoiceId

        } = persona;

console.log("TRANSFER STEP C");


await this.runtime.activatePersona(
    persona,
    true
);

console.log("TRANSFER STEP D");

return {

    success: true,

    targetPersona,

    promptFile,

    elevenLabsVoiceId

};

    }

}

module.exports = {

    PersonaTransferHandler

};