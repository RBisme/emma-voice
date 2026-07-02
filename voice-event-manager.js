/**
 * ============================================================
 * TM Voice V3
 * Voice Event Manager
 * ------------------------------------------------------------
 * Manages Voice Control Layer events.
 *
 * Responsibilities:
 *   - Event creation
 *   - Event validation
 *   - Event registration
 *   - Event history
 *
 * No vendor-specific logic.
 * No runtime logic.
 * ============================================================
 */

class VoiceEventManager {

    constructor() {

        this.events = [];
        this.nextId = 1;

    }

    createEvent(type, data = {}) {

        if (!type) {
            throw new Error("Event type is required.");
        }

        const event = {

            id: this.nextId++,

            type,

            timestamp: new Date().toISOString(),

            data

        };

        this.events.push(event);

        return event;

    }

    getEvents() {

        return [...this.events];

    }

    getEvent(id) {

        return this.events.find(event => event.id === id);

    }

    clearEvents() {

        this.events = [];
        this.nextId = 1;

    }

}

module.exports = {

    VoiceEventManager

};