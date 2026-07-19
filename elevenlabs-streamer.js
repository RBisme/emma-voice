const fetch = require("node-fetch");

class ElevenLabsStreamer {

    constructor({

      twilioStream,

        voiceId,

        apiKey

    }) {

        this.twilioStream = twilioStream;

        this.voiceId = voiceId;

        this.apiKey = apiKey;

        this.isSpeaking = false;

    }

    async speak(text) {

if (!this.twilioStream) {

    console.warn(
        "No Twilio stream."
    );

    return;

}

        this.isSpeaking = true;

        try {

            const response = await fetch(

                `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream?output_format=ulaw_8000`,

                {

                    method: "POST",

                    headers: {

                        "xi-api-key": this.apiKey,

                        "Content-Type": "application/json",

                        Accept: "audio/basic",

                        "Accept-Encoding": "identity"

                    },

                    body: JSON.stringify({

                        text,

                        model_id: "eleven_multilingual_v2",

                        voice_settings: {

                            stability: 0.5,

                            similarity_boost: 0.75,

                            style: 0.0,

                            use_speaker_boost: true,

                            speed: 1.0

                        },

                        output_format: "ulaw_8000"

                    })

                }

            );

            if (!response.ok) {

                console.error(

                    await response.text()

                );

                this.isSpeaking = false;

                return;

            }

            let buffer = Buffer.alloc(0);

            const CHUNK_SIZE = 640;

            for await (const chunk of response.body) {

                if (!this.isSpeaking) {

                    break;

                }

                buffer = Buffer.concat([

                    buffer,

                    chunk

                ]);

                while (

                    buffer.length >= CHUNK_SIZE

                ) {

                    const audio =

                        buffer.slice(

                            0,

                            CHUNK_SIZE

                        );

                    buffer =

                        buffer.slice(

                            CHUNK_SIZE

                        );

                    this.twilioStream.sendAudio(

    audio.toString("base64")

);

                }

            }

            if (

                buffer.length > 0 &&

                this.isSpeaking

            ) {

               this.twilioStream.sendAudio(

    buffer.toString("base64")

);

            }

        }

        finally {

            this.isSpeaking = false;

        }

    }

}

module.exports = {

    ElevenLabsStreamer

};