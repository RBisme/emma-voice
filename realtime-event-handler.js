/**
 * ============================================================
 * TradesMagic
 * OpenAI Realtime Event Handler
 * ============================================================
 *
 * Routes OpenAI Realtime events to registered handlers.
 *
 * Responsibilities:
 *
 * • Receive OpenAI events
 * • Dispatch by event type
 * • Register handlers
 *
 * Does NOT:
 *
 * • Talk to Twilio
 * • Execute Runtime
 * • Generate speech
 * • Manage sessions
 *
 * ============================================================
 */

class RealtimeEventHandler {

    constructor() {

        this.handlers = new Map();

    }

    register(eventType, handler) {

        this.handlers.set(eventType, handler);

    }

    async handle(event) {

        if (!event || !event.type) {
            return;
        }

        const handler = this.handlers.get(event.type);

        if (!handler) {
            return;
        }

        await handler(event);

    }

}

module.exports = {

    RealtimeEventHandler

};