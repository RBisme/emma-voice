/**
 * ============================================================
 * TradesMagic
 * Realtime Audio Handler
 * ============================================================
 *
 * Processes audio events received from OpenAI Realtime.
 *
 * Responsibilities:
 *
 * • Receive output audio deltas
 * • Forward audio to registered consumers
 *
 * Audio transport is handled elsewhere.
 *
 * ============================================================
 */

class RealtimeAudioHandler {

    constructor() {

        this.listeners = [];

    }

    onAudio(listener) {

        this.listeners.push(listener);

    }

    process(event) {

        if (
            event.type !==
            "response.output_audio.delta"
        ) {

            return;

        }

console.log(
    "AUDIO DELTA:",
    event.delta.length
);

        this.listeners.forEach(listener => {

            listener(event.delta);

        });

    }

}

module.exports = {

    RealtimeAudioHandler

};