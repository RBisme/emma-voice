/**
 * ============================================================
 * TradesMagic
 * Realtime Transcript Handler
 * ============================================================
 *
 * Accumulates transcript deltas received from
 * OpenAI Realtime and produces completed transcripts.
 *
 * Responsibilities:
 *
 * • Collect transcript deltas
 * • Detect completed transcript
 * • Reset transcript buffer
 *
 * ============================================================
 */

class RealtimeTranscriptHandler {

    constructor() {

        this.transcript = "";

    }

    process(event) {

        switch (event.type) {

            case "response.output_audio_transcript.delta":

                this.transcript += event.delta || "";

                return null;

            case "response.output_audio_transcript.done":

               this.transcript = "";
               return event.transcript || "";

            default:

                return null;

        }

    }

}

module.exports = {

    RealtimeTranscriptHandler

};