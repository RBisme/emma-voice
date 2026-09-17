const fs = require("fs");
const path = require("path");

function loadManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Manifest not found: ${manifestPath}`
    );
  }

  const content = fs.readFileSync(
    manifestPath,
    "utf8"
  );

  return {
    manifestPath,
    content
  };
}

module.exports = {
  loadManifest
};