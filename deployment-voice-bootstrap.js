/**
 * ============================================================
 * TradesMagic
 * Deployment Voice Bootstrap
 * ============================================================
 *
 * Purpose
 *
 * Creates an operational deployment and injects it into
 * the existing Voice Runtime.
 *
 * Owns NO:
 *
 * • Business Logic
 * • Voice Logic
 * • AI Logic
 * • Transport
 *
 * ============================================================
 */

const {
    startRuntime
} = require("../OBM/runtime/obm-runtime-engine");

const createLiveVoiceRuntime =
    require("./live-voice-runtime");

function createDeploymentVoiceRuntime({

    manifestPath,

    websocket,

    twilioStream

}) {

    const deployment =
        startRuntime(
            manifestPath
        );

    return createLiveVoiceRuntime({

        deployment,

        websocket,

        twilioStream

    });

}

module.exports = {

    createDeploymentVoiceRuntime

};