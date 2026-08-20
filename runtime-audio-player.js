/**
 * ============================================================
 * TradesMagic
 * Runtime Audio Player
 * ============================================================
 *
 * Responsibilities:
 *
 * • Play runtime audio assets
 * • Stream prerecorded audio to Twilio
 * • Support runtime audio playback
 *
 * Owns NO:
 *
 * • Persona transfers
 * • Business logic
 * • Conversation logic
 * • Runtime lifecycle
 *
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

class RuntimeAudioPlayer {

    constructor(runtime) {

        this.runtime = runtime;

    }


    async pause(milliseconds) {

        return new Promise(resolve =>

            setTimeout(resolve, milliseconds)

        );

    }

async playWaveFile(filename) {

    const file = path.join(
        __dirname,
        filename
    );

    const data = fs.readFileSync(file);

    const audio = data.slice(44);

    const CHUNK_SIZE = 640;

    for (

        let offset = 0;

        offset < audio.length;

        offset += CHUNK_SIZE

    ) {

        const chunk = audio.slice(

            offset,

            offset + CHUNK_SIZE

        );

        this.runtime.twilioStream.sendAudio(

            chunk.toString("base64")

        );

        await this.pause(20);

    }

    const mark =

        `ring_${Date.now()}`;

    this.runtime.twilioStream.sendMark(

        mark

    );

    await this.runtime.twilioStream.waitForMark(

        mark

    );

}

async playTransferSequence() {

    console.log("TRANSFER RING START");

await this.playWaveFile(
    "audio-library/rings/transfer-ring.wav"
);

    console.log("TRANSFER RING END");

}

}

module.exports = {

    RuntimeAudioPlayer

};