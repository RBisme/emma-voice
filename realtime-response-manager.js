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

    console.log("CREATE RESPONSE CALLED");

    const response = {};

    if (instructions) {

        response.instructions = instructions;

    }

console.log("STEP 5 - sending response.create");

console.log(
    "RESPONSE.CREATE INSTRUCTIONS:"
);

console.log(instructions);

    this.session.send({

        type: "response.create",

        response

    });

}

}

module.exports = {

    RealtimeResponseManager

};