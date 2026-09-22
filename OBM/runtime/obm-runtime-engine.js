const {
  loadManifest
} = require("./obm-manifest-loader");

const {
  parseManifest
} = require("./obm-manifest-parser");

const {
  loadModules
} = require("./obm-module-loader");

const {
  createDeployment
} = require("./obm-deployment-engine");

const {
  loadRouting
} = require("./obm-routing-loader");

const {
  loadVoice
} = require("./obm-voice-loader");

const {
  loadIntegrations
} = require("./obm-integration-loader");

const {
  validateDeployment
} = require("./obm-deployment-validator");

const {
  activateDeployment
} = require("./obm-deployment-activator");

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
  registerTask,
  reviewOpenTasks
} = require("./obm-task-registry");

function startRuntime(manifestPath) {
  const manifest =
    loadManifest(manifestPath);


  const parsedManifest =
    parseManifest(
      manifest.content
    );

  const activeModules =
    loadModules(
      parsedManifest
    );

const routing =
  loadRouting(
    parsedManifest
  );

const voice =
  loadVoice(
    parsedManifest
  );

const integrations =
  loadIntegrations(
    parsedManifest
  );

  const deployment =
    createDeployment(
      parsedManifest
    );

  deployment.activeModules =
    activeModules;

deployment.routing =
  routing;

deployment.voice =
  voice;

deployment.integrations =
  integrations;

const validation =
  validateDeployment(
    deployment
  );

deployment.validation =
  validation;

activateDeployment(
  deployment
);

  console.log(
    "OBM Runtime Started"
  );

  console.log(
    `Manifest Loaded: ${manifestPath}`
  );

  console.log(
    `Business ID: ${parsedManifest.businessId}`
  );

  console.log(
    `Modules Loaded: ${activeModules.length}`
  );

console.log(
  `Routes Loaded: ${routing.length}`
);

console.log(
  `Voice Assigned: ${voice.primaryVoice}`
);

console.log(
  `Integrations Loaded: ${integrations.length}`
);

console.log(
  `Deployment Valid: ${validation.valid}`
);

console.log(
  `Deployment Status: ${deployment.status}`
);

  console.log(
    `Deployment Created: ${deployment.deploymentId}`
  );

deployment.processEvent = function(event) {

  const processedEvent =
    processEvent(event);

  const route =
    routeEvent(
      processedEvent,
      deployment
    );

  if (!route) {

    return {

      accepted: false,

      reason:
        "No matching route.",

      event:
        processedEvent

    };

  }

  const workflow =
    executeWorkflow(
      processedEvent,
      route
    );

  const action =
    executeModule(
      workflow
    );

  const task =
    createTask(
      workflow,
      action
    );

  registerTask(
    task
  );

  return {

    accepted: true,

    event:
      processedEvent,

    route,

    workflow,

    action,

    task

  };

};

deployment.reviewOpenTasks = reviewOpenTasks;

  return deployment;
}

module.exports = {
  startRuntime
};