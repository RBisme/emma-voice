/**
 * ============================================================
 * TradesMagic
 * Twilio Audio Stream
 * ============================================================
 *
 * Bridges audio between Twilio and the Voice Runtime.
 *
 * Responsibilities:
 *
 * • Receive inbound audio payloads
 * • Forward outbound audio payloads
 * • Remain transport-neutral
 *
 * ============================================================
 */

class TwilioAudioStream {

    constructor(mediaStream) {

        this.mediaStream = mediaStream;

        this.audioListeners = [];

    }

    onAudio(listener) {

        this.audioListeners.push(listener);

    }

    receive(base64Audio) {

        this.audioListeners.forEach(listener => {

            listener(base64Audio);

        });

    }

    send(base64Audio) {

        this.mediaStream.sendAudio(base64Audio);

    }

}

module.exports = {

    TwilioAudioStream

};