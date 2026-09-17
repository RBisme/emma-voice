function activateDeployment(
  deployment
) {
  if (
    deployment.validation &&
    deployment.validation.valid
  ) {
    deployment.status =
      "active";
  } else {
    deployment.status =
      "validation_failed";
  }

  return deployment;
}

module.exports = {
  activateDeployment
};