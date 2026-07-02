/**
 * ============================================================
 * TM Voice V3
 * Voice Interruption Manager
 * ------------------------------------------------------------
 * Detects and manages caller interruptions.
 *
 * Responsibilities:
 *   - Interruption detection
 *   - Interruption state
 *   - Interruption timing
 *   - Interruption lifecycle
 *
 * Vendor Agnostic
 * Runtime Agnostic
 * ============================================================
 */

class VoiceInterruptionManager {

    constructor(config = {}) {

        this.enabled = config.enabled ?? true;

        this.active = false;

        this.startedAt = null;

        this.count = 0;

    }

    start() {

        if (!this.enabled || this.active) {
            return false;
        }

        this.active = true;

        this.startedAt = Date.now();

        this.count++;

        return true;

    }

    stop() {

        if (!this.active) {
            return false;
        }

        this.active = false;

        this.startedAt = null;

        return true;

    }

    isActive() {

        return this.active;

    }

    getDuration() {

        if (!this.active || !this.startedAt) {
            return 0;
        }

        return Date.now() - this.startedAt;

    }

    getCount() {

        return this.count;

    }

    reset() {

        this.active = false;

        this.startedAt = null;

        this.count = 0;

    }

}

module.exports = {

    VoiceInterruptionManager

};