export function getWaterStatus(percentage, lowThreshold = 30, highThreshold = 80) {
  if (percentage <= lowThreshold) return "LOW";
  if (percentage >= highThreshold) return "HIGH";
  return "NORMAL";
}

/**
 * Derive whether water is refilling into the tank, being used out of it, or idle.
 * Refill = pump ON (reservoir → tank). Usage = level falling while pump OFF.
 */
export function getFlowState(reading, previousReading, thresholds = {}) {
  const low = thresholds.lowThreshold ?? 30;
  const high = thresholds.highThreshold ?? 80;
  const level = reading.waterLevelPercentage ?? 0;

  if (reading.pumpStatus) {
    const trigger =
      level <= low
        ? "Low level triggered automatic refill."
        : "Pump running — topping up storage tank.";
    return {
      type: "REFILL",
      direction: "in",
      label: "Refilling tank",
      detail: "Pump is moving water from the reservoir into the storage tank.",
      source: "Reservoir",
      destination: "Storage tank",
      trigger,
    };
  }

  if (
    previousReading &&
    level < previousReading.waterLevelPercentage - 0.4
  ) {
    return {
      type: "USAGE",
      direction: "out",
      label: "Water in use",
      detail: "Tank level is falling — water is being drawn for use.",
      source: "Storage tank",
      destination: "Supply / outlets",
      trigger: "Consumption with pump off.",
    };
  }

  if (level >= high) {
    return {
      type: "IDLE",
      direction: "none",
      label: "Tank full",
      detail: "Level at or above high threshold. Refill not needed.",
      source: null,
      destination: null,
      trigger: null,
    };
  }

  return {
    type: "IDLE",
    direction: "none",
    label: "Stable",
    detail: "No active refill or significant draw right now.",
    source: null,
    destination: null,
    trigger: null,
  };
}

export function flowTypeClass(type) {
  if (type === "REFILL") return "flow-refill";
  if (type === "USAGE") return "flow-usage";
  return "flow-idle";
}

export function formatDateTime(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function severityClass(severity = "INFO") {
  return `severity-${severity.toLowerCase()}`;
}
