/**
 * ============================================================
 * TM Voice V3
 * Voice State Manager
 * ------------------------------------------------------------
 * Manages conversational state for the TM Voice Control Layer.
 *
 * Responsibilities:
 *   - State storage
 *   - State transitions
 *   - Transition validation
 *   - State history
 *
 * No vendor-specific logic.
 * No runtime logic.
 * ============================================================
 */

const STATES = Object.freeze({
    IDLE: "IDLE",
    LISTENING: "LISTENING",
    THINKING: "THINKING",
    SPEAKING: "SPEAKING",
    INTERRUPTED: "INTERRUPTED",
    COOLDOWN: "COOLDOWN",
    ESCALATING: "ESCALATING",
    ENDED: "ENDED"
});

const VALID_TRANSITIONS = {

    IDLE: [
        STATES.LISTENING
    ],

    LISTENING: [
        STATES.THINKING,
        STATES.ENDED
    ],

    THINKING: [
        STATES.SPEAKING,
        STATES.LISTENING,
        STATES.ENDED
    ],

    SPEAKING: [
        STATES.LISTENING,
        STATES.INTERRUPTED,
        STATES.COOLDOWN,
        STATES.ENDED
    ],

    INTERRUPTED: [
        STATES.LISTENING,
        STATES.THINKING,
        STATES.SPEAKING,
        STATES.ENDED
    ],

    COOLDOWN: [
        STATES.LISTENING,
        STATES.ENDED
    ],

    ESCALATING: [
        STATES.SPEAKING,
        STATES.ENDED
    ],

    ENDED: []
};

class VoiceStateManager {

    constructor() {

        this.currentState = STATES.IDLE;
        this.previousState = null;
        this.history = [];

        this.recordTransition(null, STATES.IDLE);
    }

    getState() {

        return this.currentState;

    }

    getPreviousState() {

        return this.previousState;

    }

    canTransition(nextState) {

        const allowed = VALID_TRANSITIONS[this.currentState] || [];

        return allowed.includes(nextState);

    }

    setState(nextState) {

        if (!Object.values(STATES).includes(nextState)) {

            throw new Error(`Unknown state: ${nextState}`);

        }

        if (!this.canTransition(nextState)) {

            throw new Error(
                `Invalid state transition: ${this.currentState} -> ${nextState}`
            );

        }

        this.previousState = this.currentState;
        this.currentState = nextState;

        this.recordTransition(
            this.previousState,
            this.currentState
        );

    }

    recordTransition(from, to) {

        this.history.push({

            timestamp: new Date().toISOString(),

            from,

            to

        });

    }

    getHistory() {

        return [...this.history];

    }

    reset() {

        this.currentState = STATES.IDLE;
        this.previousState = null;
        this.history = [];

        this.recordTransition(null, STATES.IDLE);

    }

}

module.exports = {

    STATES,

    VoiceStateManager

};