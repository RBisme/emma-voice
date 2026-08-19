/**
 * ============================================================
 * TradesMagic
 * Voice Runtime Assembler
 * ============================================================
 *
 * Wires together all Voice V3 runtime components.
 *
 * This file performs dependency injection only.
 *
 * No business logic.
 * No transport logic.
 * No AI logic.
 *
 * ============================================================
 */

function assembleVoiceRuntime(runtime) {

    console.log(
        "ASSEMBLER — elevenLabsStreamer present:",
        !!runtime.elevenLabsStreamer,
        typeof runtime.elevenLabsStreamer
    );

    //
    // Realtime Session
    //
    runtime.session.onEvent(
        event => runtime.eventHandler.handle(event)
    );

    //
    // Text Pipeline (Realtime is in text-only mode — no audio events fire)
    //
    runtime.eventHandler.register(
        "response.output_text.done",
        async event => {

            console.log(
                "TEXT HANDLER FIRED — raw event:",
                JSON.stringify(event)
            );

            const text = event.text || "";

            console.log(
                "TEXT HANDLER — text value:",
                JSON.stringify(text)
            );

            if (!text) {

                console.log(
                    "TEXT HANDLER — empty, returning early"
                );

                return;

            }

console.log("RAW AI TEXT:", text);

            const transferMatch =
                text.match(
                    /TRANSFER_PERSONA:([A-Za-z0-9_]+)/i
                );

            const spokenText =
                text.replace(
                    /TRANSFER_PERSONA:[A-Za-z0-9_]+/gi,
                    ""
                ).trim();

            console.log(
                "TEXT HANDLER — calling speak() now"
            );

if (spokenText) {

    await runtime.elevenLabsStreamer.speak(
        spokenText
    );

}

if (transferMatch) {

    await runtime.personaTransferHandler.transfer(
        transferMatch[1]
    );

    return;

}
            await runtime.pipeline.process({
                transcript: spokenText
            });

        }
    );

}

module.exports = {
    assembleVoiceRuntime
};