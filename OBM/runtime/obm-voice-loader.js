function loadVoice(parsedManifest) {
  return {
    primaryVoice:
      parsedManifest.primaryPersona,

    voicePoolSource:
      "OBM Approved Voice Pool",

    assigned: true
  };
}

module.exports = {
  loadVoice
};