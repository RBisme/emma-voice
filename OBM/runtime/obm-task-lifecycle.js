const {
  loadTasks,
  saveTasks
} = require(
  "./obm-task-store"
);


function isValidTransition(
  currentStatus,
  newStatus
) {
  const transitions = {
    open: [
      "in_progress",
      "completed",
      "cancelled",
      "escalated"
    ],

    in_progress: [
      "completed",
      "cancelled",
      "escalated"
    ],

    escalated: [
      "completed",
      "cancelled"
    ]
  };

  return (
    transitions[
      currentStatus
    ] || []
  ).includes(
    newStatus
  );
}

function canEscalate(
  task
) {
  if (!task) {
    throw new Error(
      "Task required"
    );
  }

  return (
    task.status ===
      "open" ||

    task.status ===
      "in_progress"
  );
}

function updateTaskStatus(
  task,
  status
) {
  if (!task) {
    throw new Error(
      "Task required"
    );
  }

  if (
    !isValidTransition(
      task.status,
      status
    )
  ) {
    throw new Error(
      `Invalid transition: ${task.status} -> ${status}`
    );
  }

  task.status =
    status;

  const tasks =
    loadTasks();

  const storedTask =
    tasks.find(
      stored =>
        stored.taskId ===
        task.taskId
    );

  if (storedTask) {
    storedTask.status =
      status;

    saveTasks(tasks);
  }

  console.log(
    `Task Updated: ${task.taskId} -> ${status}`
  );

  return task;
}

module.exports = {
  isValidTransition,
  canEscalate,
  updateTaskStatus
};