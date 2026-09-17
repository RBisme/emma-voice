function validateDeployment(
  deployment
) {
  const issues = [];

  if (
    !deployment.voice
  ) {
    issues.push(
      "Voice missing"
    );
  }

  if (
    !deployment.activeModules ||
    deployment.activeModules.length === 0
  ) {
    issues.push(
      "No modules loaded"
    );
  }

  if (
    !deployment.routing ||
    deployment.routing.length === 0
  ) {
    issues.push(
      "No routing loaded"
    );
  }

  if (
    !deployment.integrations ||
    deployment.integrations.length === 0
  ) {
    issues.push(
      "No integrations loaded"
    );
  }

  return {
    valid:
      issues.length === 0,

    issues
  };
}

module.exports = {
  validateDeployment
};