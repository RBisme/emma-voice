const {
  assignTaskOwner
} = require(
  "./obm-task-ownership"
);

const {
  assignTaskPriority
} = require(
  "./obm-task-priority"
);

function createTask(
  workflow,
  action
) {
  if (!workflow) {
    throw new Error(
      "Workflow required"
    );
  }

  if (!action) {
    throw new Error(
      "Action required"
    );
  }

  const task = {
    taskId:
      `TASK-${Date.now()}`,

    workflowId:
      workflow.workflowId,

    actionId:
      action.actionId,

    module:
      workflow.module,

    taskType:
      action.action,

    status:
      "open",

    createdAt:
      new Date().toISOString()
  };

const ownership =
  assignTaskOwner(task);

task.owner_type =
  ownership.owner_type;

task.owner =
  ownership.owner;

const priority =
  assignTaskPriority(task);

task.priority =
  priority.priority;

  console.log(
    `Task Created: ${task.taskType}`
  );

  return task;
}



module.exports = {
  createTask
};