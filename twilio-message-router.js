/**
 * ============================================================
 * TradesMagic
 * Twilio Message Router
 * ============================================================
 *
 * Routes incoming Twilio websocket messages.
 *
 * Responsibilities:
 *
 * • Parse websocket messages
 * • Route Start events
 * • Route Media events
 * • Route Stop events
 *
 * Does NOT:
 *
 * • Talk to OpenAI
 * • Process Audio
 * • Execute Runtime
 *
 * ============================================================
 */

class TwilioMessageRouter {

    constructor() {

        this.handlers = new Map();

    }

    register(eventType, handler) {

        this.handlers.set(eventType, handler);

    }

    async route(message) {

        const handler =
            this.handlers.get(message.event);

        if (!handler) {

            return;

        }

        await handler(message);

    }

}

module.exports = {

    TwilioMessageRouter

};