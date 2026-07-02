/**
 * ============================================================
 * TM Voice V3
 * Voice Runtime Bridge
 * ------------------------------------------------------------
 * Connects the Voice Control Layer to the existing
 * TradesMagic OBM Runtime.
 *
 * Responsibilities:
 *   - Receive operational voice events
 *   - Validate runtime interface
 *   - Dispatch events into the OBM Runtime
 *
 * This file does NOT:
 *   - Detect intent
 *   - Execute workflows
 *   - Create tasks
 *   - Perform routing
 *
 * Those responsibilities already belong to the OBM Runtime.
 * ============================================================
 */

class VoiceRuntimeBridge {

    constructor(runtime) {

        if (!runtime) {
            throw new Error("VoiceRuntimeBridge requires a runtime instance.");
        }

        if (typeof runtime.processEvent !== "function") {
            throw new Error(
                "Runtime does not expose processEvent()."
            );
        }

        this.runtime = runtime;

    }

    dispatch(event) {

        if (!event) {
            throw new Error("Runtime event is required.");
        }

        if (!event.type) {
            throw new Error("Runtime event type is required.");
        }

        return this.runtime.processEvent(event);

    }

}

module.exports = {

    VoiceRuntimeBridge

};