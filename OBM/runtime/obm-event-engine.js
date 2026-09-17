function processEvent(event) {
  if (!event) {
    throw new Error(
      "Event required"
    );
  }

  if (!event.type) {
    throw new Error(
      "Event type required"
    );
  }

  const processedEvent = {
    eventId:
      `EVENT-${Date.now()}`,

    ...event,

    status: "received",

    timestamp:
      new Date().toISOString()
  };

  console.log(
    `Event Received: ${processedEvent.type}`
  );

  return processedEvent;
}

module.exports = {
  processEvent
};