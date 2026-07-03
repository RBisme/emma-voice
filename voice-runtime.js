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

class VoiceRuntime {

   constructor({

    session,

    responseManager,

    eventHandler,

    transcriptHandler,

    audioHandler,

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

        this.twilioStream = twilioStream;

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
    new VoiceRuntimeDispatcher();

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

        console.log(
            "Stopping TradesMagic Voice Runtime..."
        );

    }

}

module.exports = {

    VoiceRuntime

};