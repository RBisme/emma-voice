function executeWorkflow(
  event,
  route
) {
  if (!event) {
    throw new Error(
      "Event required"
    );
  }

  if (!route) {
    throw new Error(
      "Route required"
    );
  }

  const workflow = {
    workflowId:
      `WORKFLOW-${Date.now()}`,

    eventId:
      event.eventId,

    trigger:
      event.type,

    module:
      route.destination,

    status:
      "active",

    createdAt:
      new Date().toISOString()
  };

  console.log(
    `Workflow Started: ${workflow.module}`
  );

  return workflow;
}

module.exports = {
  executeWorkflow
};