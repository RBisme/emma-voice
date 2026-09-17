function loadModules(parsedManifest) {

  if (
    !parsedManifest.activeModules
  ) {
    return [];
  }

  return parsedManifest.activeModules;
}

module.exports = {
  loadModules
};