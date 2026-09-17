const {
  startRuntime
} = require("./obm-runtime-engine");

const {
  processEvent
} = require("./obm-event-engine");

const {
  routeEvent
} = require("./obm-event-router");

const {
  executeWorkflow
} = require("./obm-workflow-engine");

const {
  executeModule
} = require("./obm-module-executor");

const {
  createTask
} = require("./obm-task-engine");

const {
  resolveTrigger
} = require(
  "./voice-trigger-resolver"
);

const {
  updateTaskStatus
} = require("./obm-task-lifecycle");

const {
  registerTask,
  getOpenTasks,
  getInProgressTasks,
  getEscalatedTasks,
  getCompletedTasks,
  getAssignedTasks,
  reviewOpenTasks
} = require("./obm-task-registry");

const manifestPath =
  process.argv[2];

if (!manifestPath) {
  console.log(
    "Usage: node obm-test-runtime.js <manifest>"
  );

  process.exit(1);
}

const deployment =
  startRuntime(
    manifestPath
  );

console.log(
  deployment
);

const resolution =
  resolveTrigger(
  "My basement flooded last night.",
    deployment
  );

console.log(
  "TRIGGER RESOLUTION"
);

console.log(
  resolution
);

const result =
  deployment.processEvent({

    type:
      resolution.trigger

  });

console.log(result);

const task =
  result.task;
const openTasks =
  getOpenTasks();

console.log(
  "OPEN TASKS"
);

console.log(
  openTasks
);

updateTaskStatus(
  task,
  "completed"
);

console.log(
  task
);

console.log(
  "COMPLETED TASKS"
);

console.log(
  getCompletedTasks()
);

console.log(
  "OWNER TASKS"
);

console.log(
  getAssignedTasks(
    "OWNER"
  )
);

const review =
  reviewOpenTasks();

console.log(
  review
);