function routeEvent(
  event,
  deployment
) {
  if (!event) {
    throw new Error(
      "Event required"
    );
  }

  if (!deployment) {
    throw new Error(
      "Deployment required"
    );
  }

 const eventType =
  event.type
    .replace(/_/g, " ")
    .toUpperCase();

const route =
  deployment.routing.find(
    r =>
      r.trigger
        .replace(/_/g, " ")
        .toUpperCase()
        .includes(eventType)
  );

  if (!route) {
    console.log(
      `No route found for ${event.type}`
    );

    return null;
  }

  console.log(
    `Event Routed: ${event.type} -> ${route.destination}`
  );

  return route;
}

module.exports = {
  routeEvent
};