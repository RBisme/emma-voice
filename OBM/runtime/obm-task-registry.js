const {
  saveTasks,
  loadTasks
} = require(
  "./obm-task-store"
);

const tasks = loadTasks();

function registerTask(
  task
) {
  if (!task) {
    throw new Error(
      "Task required"
    );
  }

  tasks.push(task);

saveTasks(tasks);

  console.log(
    `Task Registered: ${task.taskId}`
  );

  return task;
}

function getOpenTasks() {
  return tasks.filter(
    task =>
      task.status === "open"
  );
}

function getInProgressTasks() {
  return tasks.filter(
    task =>
      task.status === "in_progress"
  );
}

function getEscalatedTasks() {
  return tasks.filter(
    task =>
      task.status === "escalated"
  );
}

function getCompletedTasks() {
  return tasks.filter(
    task =>
      task.status === "completed"
  );
}

function getAssignedTasks(
  owner
) {
  return tasks.filter(
    task =>
      task.owner === owner
  );
}

function getAllTasks() {
  return loadTasks();
}

function reviewOpenTasks() {
  const openTasks =
    getOpenTasks();

  console.log(
    "OPERATIONAL REVIEW"
  );

  console.log(
    `Open Tasks: ${openTasks.length}`
  );

  return openTasks;
}

module.exports = {
  registerTask,
  getOpenTasks,
  getInProgressTasks,
  getEscalatedTasks,
  getCompletedTasks,
  getAssignedTasks,
  getAllTasks,
  reviewOpenTasks
};