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

    //
    // Realtime Session
    //

    runtime.session.onEvent(

        event => runtime.eventHandler.handle(event)

    );

    //
    // Transcript Pipeline
    //

    runtime.eventHandler.register(

    "response.output_audio.delta",

    event => {

        console.log(
            "STEP 1 - output_audio.delta"
        );

        runtime.audioHandler.process(event);

    }

);

runtime.audioHandler.onAudio(

    audio => {

        console.log(
            "STEP 2 - onAudio",
            audio.length
        );

        runtime.twilioStream.sendAudio(audio);

        console.log(
            "STEP 3 - sendAudio called"
        );

    }

);

    runtime.eventHandler.register(

        "response.output_audio_transcript.done",

        async event => {

            const transcript =
                runtime.transcriptHandler.process(event);

            if (!transcript) {

                return;

            }

            await runtime.pipeline.process({

                transcript

            });

        }

    );

    //
    // Audio

    //

    runtime.eventHandler.register(

        "response.output_audio.delta",

        event => runtime.audioHandler.process(event)

    );

    runtime.audioHandler.onAudio(

        audio => runtime.twilioStream.sendAudio(audio)

    );

}

module.exports = {

    assembleVoiceRuntime

};