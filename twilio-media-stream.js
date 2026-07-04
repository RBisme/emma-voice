/**
 * ============================================================
 * TradesMagic
 * Twilio Media Stream
 * ============================================================
 *
 * Owns communication with the Twilio Media Stream.
 *
 * Responsibilities:
 *
 * • Maintain Stream SID
 * • Receive inbound media
 * • Send outbound media
 * • Notify listeners
 *
 * Does NOT:
 *
 * • Talk to OpenAI
 * • Execute Runtime
 * • Generate Speech
 *
 * ============================================================
 */

class TwilioMediaStream {

    constructor(ws) {

        this.ws = ws;

        this.streamSid = null;

        this.mediaListeners = [];

    }

    setStreamSid(streamSid) {

        this.streamSid = streamSid;

    }

    onMedia(listener) {

        this.mediaListeners.push(listener);

    }

    receive(data) {

        if (
            data.event === "media"
        ) {

            this.mediaListeners.forEach(listener => {

                listener(data.media.payload);

            });

        }

    }

    sendAudio(base64Audio) {

        if (!this.streamSid) {

            return;

        }

        this.ws.send(

            JSON.stringify({

                event: "media",

                streamSid: this.streamSid,

                media: {

                    payload: base64Audio

                }

            })

        );

    }

}

module.exports = {

    TwilioMediaStream

};