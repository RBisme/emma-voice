function parseManifest(manifestContent) {
  return {
    rawContent: manifestContent,

    businessId:
      extractValue(
        manifestContent,
        "BUSINESS\\_ID:"
      ),

    businessType:
      extractValue(
        manifestContent,
        "BUSINESS\\_TYPE:"
      ),

    primaryPersona:
      extractValue(
        manifestContent,
        "PRIMARY\\_PERSONA:"
      ),

    communicationTone:
      extractValue(
        manifestContent,
        "COMMUNICATION\\_TONE:"
      ),

    afterHoursBehavior:
      extractValue(
        manifestContent,
        "AFTER\\_HOURS\\_BEHAVIOR:"
      ),

    emergencyAvailability:
      extractValue(
        manifestContent,
        "EMERGENCY\\_AVAILABILITY:"
      ),

   activeModules:
  extractModules(
    manifestContent
  ),

    supportedServices:
      extractSectionList(
        manifestContent,
        "SUPPORTED SERVICES"
      ),

   routing:
  extractRouting(
    manifestContent
  )
  };
}

function extractSectionList(
  content,
  sectionMarker
) {
  const index =
    content.indexOf(
      sectionMarker
    );

  if (index === -1) {
    return [];
  }

  const remaining =
    content.substring(index);

  const lines =
    remaining
      .split("\n")
      .slice(1)
      .map(line => line.trim());

  const results = [];

  for (const line of lines) {
    if (
      line.includes("---") ||
      line.startsWith("#") ||
      line.startsWith("\\#")
    ) {
      break;
    }

    if (
      line.startsWith("*") ||
      line.startsWith("\\*")
    ) {
      results.push(
        line
          .replace("\\*", "")
          .replace("*", "")
          .trim()
      );
    }
  }

  return results;
}

function extractModules(
  content
) {
  const modules = [];

  const lines =
    content.split("\n");

  for (const line of lines) {
    const trimmed =
      line.trim();

    if (
      (
        trimmed.startsWith("##") ||
        trimmed.startsWith("\\##")
      ) &&
      trimmed.includes("Module")
    ) {
      modules.push(
        trimmed
          .replace(/^\\?#+\s*/, "")
          .trim()
      );
    }
  }

  return modules;
}

function extractRouting(
  content
) {
  const routes = [];

  const lines =
    content.split("\n");

  let inRouting = false;
  let trigger = null;

  for (const line of lines) {
    const trimmed =
      line.trim();

    if (
      trimmed.includes("ROUTING RULES")
    ) {
      inRouting = true;
      continue;
    }

    if (
      inRouting &&
      (
        trimmed.startsWith("#") ||
        trimmed.startsWith("\\#")
      ) &&
      !trimmed.includes("ROUTING RULES")
    ) {
      break;
    }

    if (!inRouting || !trimmed) {
      continue;
    }

    if (
      trimmed.startsWith("→") ||
      trimmed.startsWith("â†’")
    ) {
      if (trigger) {
        routes.push(
          `${trigger} ${trimmed}`
        );
      }

      trigger = null;
    }
    else {
      trigger = trimmed;
    }
  }

  return routes;
}

function extractValue(
  content,
  marker
) {
  const index =
    content.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const remaining =
    content.substring(
      index + marker.length
    );

  const lines =
    remaining
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  return lines[0] || null;
}

module.exports = {
  parseManifest
};