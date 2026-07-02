/**
 * ============================================================
 * TradesMagic
 * Realtime Response Manager
 * ============================================================
 *
 * Owns response generation requests sent to
 * OpenAI Realtime.
 *
 * Responsibilities:
 *
 * • Request responses
 * • Submit instructions
 * • Keep response creation centralized
 *
 * Does NOT:
 *
 * • Manage sessions
 * • Handle events
 * • Process transcripts
 *
 * ============================================================
 */

class RealtimeResponseManager {

    constructor(session) {

        this.session = session;

    }

    createResponse(instructions) {

        this.session.send({

            type: "response.create",

            response: {

                instructions

            }

        });

    }

}

module.exports = {

    RealtimeResponseManager

};