/**
 * ============================================================
 * TM Voice V3
 * Voice Cooldown Manager
 * ------------------------------------------------------------
 * Prevents immediate re-triggering after speech,
 * interruptions, or other voice events.
 *
 * Responsibilities:
 *   - Cooldown timing
 *   - Active cooldown state
 *   - Expiration detection
 *
 * Vendor Agnostic
 * Runtime Agnostic
 * ============================================================
 */

class VoiceCooldownManager {

    constructor(config = {}) {

        this.defaultCooldown = config.defaultCooldown ?? 750;

        this.expiresAt = null;

    }

    start(duration = this.defaultCooldown) {

        this.expiresAt = Date.now() + duration;

    }

    isActive() {

        if (this.expiresAt === null) {
            return false;
        }

        if (Date.now() >= this.expiresAt) {

            this.expiresAt = null;

            return false;

        }

        return true;

    }

    getRemaining() {

        if (!this.isActive()) {
            return 0;
        }

        return Math.max(0, this.expiresAt - Date.now());

    }

    clear() {

        this.expiresAt = null;

    }

}

module.exports = {

    VoiceCooldownManager

};