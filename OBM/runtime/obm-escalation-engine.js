function escalateTask(
  task,
  escalationType = "STANDARD_ESCALATION"
) {
  if (!task) {
    throw new Error(
      "Task required"
    );
  }

  const result = {
    taskId: task.taskId,
    escalationType,
    actions: []
  };

  if (
    task.priority === "P3"
  ) {
    task.priority = "P2";

    result.actions.push(
      "PRIORITY_INCREASED"
    );
  }
  else if (
    task.priority === "P2"
  ) {
    task.priority = "P1";

    result.actions.push(
      "PRIORITY_INCREASED"
    );
  }

  result.actions.push(
    "OWNER_NOTIFIED"
  );

  if (
    escalationType ===
    "EMERGENCY_ESCALATION"
  ) {
    result.actions.push(
      "MANAGEMENT_NOTIFIED"
    );

    result.actions.push(
      "ALTERNATE_WORKFLOW_TRIGGERED"
    );
  }

  console.log(
    `Task Escalated: ${task.taskId}`
  );

  return result;
}

module.exports = {
  escalateTask
};