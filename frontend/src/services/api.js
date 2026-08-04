const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const now = new Date();

/** Demo timeline: usage drawdown, then low-level refill from reservoir. */
const story = [
  { waterLevelPercentage: 72, pumpStatus: false },
  { waterLevelPercentage: 65, pumpStatus: false },
  { waterLevelPercentage: 58, pumpStatus: false },
  { waterLevelPercentage: 51, pumpStatus: false },
  { waterLevelPercentage: 44, pumpStatus: false },
  { waterLevelPercentage: 38, pumpStatus: false },
  { waterLevelPercentage: 28, pumpStatus: true },
  { waterLevelPercentage: 34, pumpStatus: true },
  { waterLevelPercentage: 41, pumpStatus: true },
  { waterLevelPercentage: 48, pumpStatus: true },
  { waterLevelPercentage: 55, pumpStatus: true },
  { waterLevelPercentage: 61, pumpStatus: false },
];

const sampleHistory = story.map((point, index) => {
  const percentage = point.waterLevelPercentage;
  return {
    id: index + 1,
    waterLevelPercentage: percentage,
    distanceCm: Number((28 - percentage * 0.22).toFixed(1)),
    pumpStatus: point.pumpStatus,
    buzzerStatus: percentage <= 30 || percentage >= 80,
    reservoirLevelPercentage: point.pumpStatus
      ? Math.max(42, 88 - index * 3)
      : Math.min(92, 72 + index * 1.5),
    createdAt: new Date(now.getTime() - (story.length - 1 - index) * 30 * 60 * 1000).toISOString(),
  };
});

const latest = sampleHistory[sampleHistory.length - 1];

const fallback = {
  status: {
    deviceName: "HydroGuard Main Controller",
    deviceStatus: "ONLINE",
    waterLevelPercentage: latest.waterLevelPercentage,
    distanceCm: latest.distanceCm,
    waterStatus: "NORMAL",
    pumpStatus: latest.pumpStatus,
    buzzerStatus: false,
    reservoirLevelPercentage: latest.reservoirLevelPercentage,
    lastSeen: now.toISOString(),
    lowThreshold: 30,
    highThreshold: 80,
    pumpMode: "AUTOMATIC",
    buzzerEnabled: true,
  },
  history: sampleHistory,
  alerts: [
    {
      id: 1,
      type: "PUMP_STOPPED",
      message: "Refill complete — pump stopped after tank returned to normal level.",
      severity: "INFO",
      resolved: true,
      createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "PUMP_ACTIVATED",
      message: "Low water detected. Refill pump activated — drawing from reservoir.",
      severity: "WARNING",
      resolved: true,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "LOW_WATER",
      message: "Tank level dropped below threshold before automatic refill began.",
      severity: "WARNING",
      resolved: true,
      createdAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000).toISOString(),
    },
  ],
  settings: {
    lowThreshold: 30,
    highThreshold: 80,
    pumpMode: "AUTOMATIC",
    buzzerEnabled: true,
  },
};

async function request(path, options = {}, fallbackValue) {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`Using HydroGuard demo data for ${path}`, error);
    return fallbackValue;
  }
}

export function getCurrentStatus() {
  return request("/status", {}, fallback.status);
}

export function getWaterHistory() {
  return request("/water/history", {}, fallback.history);
}

export function getAlerts() {
  return request("/alerts", {}, fallback.alerts);
}

export function getSettings() {
  return request("/settings", {}, fallback.settings);
}

export function updateSettings(settings) {
  fallback.settings = { ...fallback.settings, ...settings };
  fallback.status = { ...fallback.status, ...settings };
  return request(
    "/settings",
    { method: "PUT", body: JSON.stringify(settings) },
    fallback.settings,
  );
}

export function submitWaterReading(reading) {
  return request(
    "/water/readings",
    { method: "POST", body: JSON.stringify(reading) },
    { ...fallback.status, ...reading, lastSeen: new Date().toISOString() },
  );
}

export function turnPumpOn() {
  fallback.status = { ...fallback.status, pumpStatus: true };
  return request("/pump/on", { method: "POST" }, fallback.status);
}

export function turnPumpOff() {
  fallback.status = { ...fallback.status, pumpStatus: false };
  return request("/pump/off", { method: "POST" }, fallback.status);
}

/** Interactive simulation functions for frontend testing */
export function simulateWaterDraw(level = 25) {
  fallback.status = {
    ...fallback.status,
    waterLevelPercentage: level,
    distanceCm: Number((28 - level * 0.22).toFixed(1)),
    waterStatus: level <= fallback.status.lowThreshold ? "LOW" : "NORMAL",
    pumpStatus: level <= fallback.status.lowThreshold,
    lastSeen: new Date().toISOString(),
  };
  const newReading = {
    id: sampleHistory.length + 1,
    waterLevelPercentage: level,
    distanceCm: fallback.status.distanceCm,
    pumpStatus: fallback.status.pumpStatus,
    buzzerStatus: level <= fallback.status.lowThreshold,
    createdAt: new Date().toISOString(),
  };
  sampleHistory.push(newReading);
  return { status: { ...fallback.status }, history: [...sampleHistory] };
}

export function simulateRefillTarget(targetLevel = 80) {
  const isPumping = targetLevel > fallback.status.waterLevelPercentage;
  fallback.status = {
    ...fallback.status,
    waterLevelPercentage: targetLevel,
    distanceCm: Number((28 - targetLevel * 0.22).toFixed(1)),
    waterStatus: targetLevel >= fallback.status.highThreshold ? "NORMAL" : targetLevel <= fallback.status.lowThreshold ? "LOW" : "NORMAL",
    pumpStatus: isPumping && targetLevel < fallback.status.highThreshold,
    lastSeen: new Date().toISOString(),
  };
  const newReading = {
    id: sampleHistory.length + 1,
    waterLevelPercentage: targetLevel,
    distanceCm: fallback.status.distanceCm,
    pumpStatus: fallback.status.pumpStatus,
    buzzerStatus: false,
    createdAt: new Date().toISOString(),
  };
  sampleHistory.push(newReading);
  return { status: { ...fallback.status }, history: [...sampleHistory] };
}

