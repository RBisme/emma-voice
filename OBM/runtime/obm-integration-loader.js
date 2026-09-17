function loadIntegrations(parsedManifest) {
  const integrations = [];

  const content =
    parsedManifest.rawContent;

  if (
    content.includes("Twilio")
  ) {
    integrations.push(
      "Twilio"
    );
  }

  if (
    content.includes("SMS")
  ) {
    integrations.push(
      "SMS"
    );
  }

  if (
    content.includes("Voice")
  ) {
    integrations.push(
      "Voice"
    );
  }

  if (
    content.includes(
      "Google Calendar"
    )
  ) {
    integrations.push(
      "Google Calendar"
    );
  }

  if (
    content.includes(
      "Dispatch Scheduling System"
    )
  ) {
    integrations.push(
      "Dispatch Scheduling System"
    );
  }

  if (
    content.includes(
      "Customer Records"
    )
  ) {
    integrations.push(
      "Customer Records"
    );
  }

  if (
    content.includes(
      "Job History"
    )
  ) {
    integrations.push(
      "Job History"
    );
  }

  if (
    content.includes(
      "Follow-Up Tracking"
    )
  ) {
    integrations.push(
      "Follow-Up Tracking"
    );
  }

  return integrations;
}

module.exports = {
  loadIntegrations
};