/**
 * ============================================================
 * TM Voice V3
 * Voice Control Layer
 * ------------------------------------------------------------
 * Central coordinator for all Voice Control Layer components.
 *
 * Responsibilities:
 *   - Initialize voice subsystems
 *   - Coordinate voice state
 *   - Coordinate events
 *   - Coordinate interruptions
 *   - Coordinate cooldowns
 *   - Apply business rules
 *
 * Vendor Agnostic
 * Runtime Agnostic
 * ============================================================
 */

const { VoiceStateManager } = require("./voice-state-manager");
const { VoiceEventManager } = require("./voice-event-manager");
const { VoiceSpeechQualifier } = require("./voice-speech-qualifier");
const { VoiceInterruptionManager } = require("./voice-interruption-manager");
const { VoiceCooldownManager } = require("./voice-cooldown-manager");
const VoiceBusinessRules = require("./voice-business-rules");

class VoiceControlLayer {

    constructor(config = {}) {

        this.state = new VoiceStateManager();

        this.events = new VoiceEventManager();

        this.qualifier = new VoiceSpeechQualifier(config.speech);

        this.interruptions = new VoiceInterruptionManager(config.interruptions);

        this.cooldown = new VoiceCooldownManager(config.cooldown);

        this.rules = VoiceBusinessRules;

    }

    getState() {

        return this.state.getState();

    }

    qualifySpeech(result) {

        return this.qualifier.qualify(result);

    }

    createEvent(type, data = {}) {

        return this.events.createEvent(type, data);

    }

    startCooldown(duration) {

        this.cooldown.start(duration);

    }

    interruptionActive() {

        return this.interruptions.isActive();

    }

    reset() {

        this.state.reset();

        this.events.clearEvents();

        this.interruptions.reset();

        this.cooldown.clear();

    }

}

module.exports = {

    VoiceControlLayer

};