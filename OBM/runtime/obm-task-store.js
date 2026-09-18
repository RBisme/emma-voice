const fs = require("fs");

const path = require("path");

const TASK_FILE =
  path.join(__dirname, "tasks.json");

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