/**
 * ============================================================
 * TM Voice V3
 * Voice Business Rules
 * ------------------------------------------------------------
 * Defines high-level conversational behavior for the
 * TM Voice Control Layer.
 *
 * Responsibilities:
 *   - Greeting behavior
 *   - Turn-taking behavior
 *   - Silence behavior
 *   - Interruption policy
 *   - Escalation policy
 *
 * This file contains no vendor logic and no runtime logic.
 * It simply defines how an Office Manager should behave.
 * ============================================================
 */

const VoiceBusinessRules = {

    greeting: {

        enabled: true,

        allowRepeatGreeting: false

    },

    turnTaking: {

        allowCallerInterruptions: true,

        interruptionGracePeriodMs: 250,

        resumeAfterInterruption: true

    },

    silence: {

        responseTimeoutMs: 5000,

        maxSilenceRetries: 2,

        promptAfterSilence: true

    },

    cooldown: {

        enabled: true,

        defaultCooldownMs: 750

    },

    escalation: {

        allowOwnerTransfer: true,

        allowEmergencyEscalation: true,

        allowDispatcherEscalation: true

    }

};

module.exports = VoiceBusinessRules;