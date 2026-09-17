const fs = require("fs");

const TASK_FILE =
  "C:/TM/OBM/runtime/tasks.json";

function saveTasks(
  tasks
) {
  fs.writeFileSync(
    TASK_FILE,
    JSON.stringify(
      tasks,
      null,
      2
    )
  );
}

function loadTasks() {
  if (
    !fs.existsSync(
      TASK_FILE
    )
  ) {
    return [];
  }

  return JSON.parse(
    fs.readFileSync(
      TASK_FILE,
      "utf8"
    )
  );
}

module.exports = {
  saveTasks,
  loadTasks
};