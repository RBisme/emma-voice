class VoiceRuntimeBridge {

    constructor() {

        this.runtime = null;

    }

    attachRuntime(runtime) {

        if (!runtime) {
            throw new Error(
                "VoiceRuntimeBridge requires a runtime instance."
            );
        }

        if (typeof runtime.processEvent !== "function") {
            throw new Error(
                "Runtime does not expose processEvent()."
            );
        }

        this.runtime = runtime;

    }

    dispatch(event) {

        if (!this.runtime) {
            throw new Error(
                "VoiceRuntimeBridge has no attached runtime."
            );
        }

        if (!event) {
            throw new Error(
                "Runtime event is required."
            );
        }

        if (!event.type) {
            throw new Error(
                "Runtime event type is required."
            );
        }

        return this.runtime.processEvent(event);

    }

}

module.exports = {

    VoiceRuntimeBridge

};