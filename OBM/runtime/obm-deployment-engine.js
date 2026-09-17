function createDeployment(manifest) {
  return {
    deploymentId:
      `DEPLOY-${Date.now()}`,

    manifest,

    status: "provisioning"
  };
}

module.exports = {
  createDeployment
};