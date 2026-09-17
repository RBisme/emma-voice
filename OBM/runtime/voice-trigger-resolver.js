function resolveTrigger(
  transcript,
  deployment
) {
  if (!transcript) {
    throw new Error(
      "Transcript required"
    );
  }

  if (!deployment) {
    throw new Error(
      "Deployment required"
    );
  }

  if (
    !deployment.routing ||
    deployment.routing.length === 0
  ) {
    return {
      trigger:
        "MANUAL_REVIEW",
      confidence: 0
    };
  }

  const availableTriggers =
    deployment.routing.map(
      r => r.trigger
    );

  const text =
    transcript.toUpperCase();

  let trigger =
    "MANUAL_REVIEW";

  let confidence =
    0;

  if (
    text.includes(
      "APPOINTMENT"
    ) ||
    text.includes(
      "SCHEDULE"
    )
  ) {
    if (
      availableTriggers.includes(
        "APPOINTMENT_REQUEST"
      )
    ) {
      trigger =
        "APPOINTMENT_REQUEST";

      confidence =
        0.90;
    }
  }

 if (
  text.includes(
    "MISSED CALL"
  ) ||
  text.includes(
    "MISSED A CALL"
  )
) {
    if (
      availableTriggers.includes(
        "MISSED_CALL"
      )
    ) {
      trigger =
        "MISSED_CALL";

      confidence =
        0.90;
    }
  }

  if (
    text.includes(
      "FOLLOW UP"
    )
  ) {
    if (
      availableTriggers.includes(
        "PATIENT_FOLLOW-UP"
      )
    ) {
      trigger =
        "PATIENT_FOLLOW-UP";

      confidence =
        0.90;
    }
  }

if (
  text.includes("FLOOD") ||
  text.includes("FLOODED") ||
  text.includes("BASEMENT") ||
  text.includes("WATER")
) {
  if (
    availableTriggers.includes(
      "FLOOD_DAMAGE"
    )
  ) {
    trigger =
      "FLOOD_DAMAGE";

    confidence =
      0.90;
  }
}

  return {
    transcript,
    availableTriggers,
    trigger,
    confidence
  };
}

module.exports = {
  resolveTrigger
};