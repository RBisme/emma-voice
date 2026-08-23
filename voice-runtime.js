/**
 * ============================================================
 * TradesMagic
 * Voice Runtime
 * ============================================================
 *
 * Central coordinator for the TradesMagic Voice Runtime.
 *
 * Responsibilities:
 *
 * • Own runtime lifecycle
 * • Coordinate major subsystems
 * • Start runtime
 * • Stop runtime
 *
 * This class intentionally contains almost no business logic.
 *
 * ============================================================
 */

const {
    VoiceRuntimeDispatcher
} = require("./voice-runtime-dispatcher");

const {
    PersonaTransferHandler
} = require("./persona-transfer-handler");


class VoiceRuntime {

   constructor({

    session,

    responseManager,

    eventHandler,

    transcriptHandler,

    audioHandler,

    elevenLabsStreamer,

    runtimeAudioPlayer,

    twilioStream,

    pipeline,

    controlLayer,

    extractor,

    resolver,

    bridge

}) {

        this.session = session;

        this.responseManager = responseManager;

        this.eventHandler = eventHandler;

        this.transcriptHandler = transcriptHandler;

        this.audioHandler = audioHandler;

        this.elevenLabsStreamer = elevenLabsStreamer;

        this.runtimeAudioPlayer = runtimeAudioPlayer;
    
        this.twilioStream = twilioStream;

        console.log(
    "VoiceRuntime twilioStream:",
    !!this.twilioStream
);

        this.pipeline = pipeline;

this.controlLayer =
    controlLayer;

this.extractor =
    extractor;

this.resolver =
    resolver;

this.bridge =
    bridge;

this.dispatcher =
    new VoiceRuntimeDispatcher(this);

this.personaTransferHandler =
    new PersonaTransferHandler(this);

    }

async activatePersona(
    persona,
    playTransferSequence = false
) {

console.log("STEP 2 - activatePersona entered");

console.log("PERSONA:", persona);
console.log("PROMPT FILE:", persona.promptFile);
console.log("VOICE ID:", persona.elevenLabsVoiceId);

    const fs = require("fs");

    const promptText =
        fs.readFileSync(
            persona.promptFile,
            "utf8"
        );

    this.elevenLabsStreamer.setVoice(
        persona.elevenLabsVoiceId
    );

    const onSessionUpdated = async event => {

        if (
            event.type !== "session.updated"
        ) {
            return;
        }

        if (
            event.session.instructions !== promptText
        ) {
            return;
        }

if (playTransferSequence) {

    console.log("STEP 4 - playing transfer sequence");

    await this.runtimeAudioPlayer.playTransferSequence();

}

console.log("STEP 5 - calling createResponse()");


       this.responseManager.createResponse(

    this.session.prompt,

`Runtime Event: ReturnFromPersona.

Runtime Event: ReturnFromPersona.

You have just resumed the conversation after another Office Intelligence persona completed their task.

Briefly welcome the caller back.

Acknowledge the transfer naturally.

After your brief greeting, stop speaking and wait for the caller to respond.

Do not continue the conversation until the caller speaks.
);

    };

console.log(
    "REGISTERING session.updated listener for:",
    persona.promptFile
);

    this.session.onEvent(
        onSessionUpdated
    );

console.log("STEP 3 - calling updateProfile()");

    this.session.updateProfile(
        promptText
    );

}

async processEvent(event) {

console.log("VOICE RUNTIME:", event.event);

    return await this.dispatcher.execute(event);

}

async connected(data) {

    return await this.processEvent({

        type: "connected",

        data

    });

}

async started(data) {

    return await this.processEvent({

        type: "start",

        data

    });

}

async media(data) {

    return await this.processEvent({

        type: "media",

        data

    });

}

     async start() {

        console.log(
            "Starting TradesMagic Voice Runtime..."
        );

        await this.session.connect();

    }

    stop() {

//        console.log(
//            "Stopping TradesMagic Voice Runtime..."
//        );

    }

}

module.exports = {

    VoiceRuntime

};