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

        this.pendingMarks = new Map();

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

    waitForMark(name) {

        return new Promise(resolve => {

            this.pendingMarks.set(
                name,
                resolve
            );

        });

    }

    receiveMark(name) {

        const resolve =

            this.pendingMarks.get(name);

        if (!resolve) {

            return;

        }

        this.pendingMarks.delete(name);

        resolve();

    }

    sendAudio(base64Audio) {

        if (!this.streamSid) {

            return;

        }

console.log("SENDING TO STREAM:", this.streamSid);

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

sendMark(name) {

    if (!this.streamSid) {

        return;

    }

    console.log("SENDING MARK:", name);

    this.ws.send(

        JSON.stringify({

            event: "mark",

            streamSid: this.streamSid,

            mark: {

                name

            }

        })

    );

}

}

module.exports = {

    TwilioMediaStream

};