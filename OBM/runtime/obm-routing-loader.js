function loadRouting(parsedManifest) {
  const routes = [];

  if (!parsedManifest.routing) {
    return routes;
  }

  for (const routeLine of parsedManifest.routing) {
    const route =
      parseRouteLine(routeLine);

    if (route) {
      routes.push(route);
    }
  }

  return routes;
}

function parseRouteLine(routeLine) {
  const parts =
  routeLine.split(/→|â†’/);

  if (parts.length !== 2) {
    return null;
  }

  return {
    trigger:
      normalizeTrigger(parts[0].trim()),

    destination:
      parts[1].trim()
  };
}

function normalizeTrigger(trigger) {
  return trigger
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/\//g, "_");
}

module.exports = {
  loadRouting
};