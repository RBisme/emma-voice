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

    }

    async start() {

        console.log(
            "Starting TradesMagic Voice Runtime..."
        );

        this.session.connect();

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