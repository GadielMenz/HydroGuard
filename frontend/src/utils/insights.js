/**
 * Derive HydroGuard insight metrics from tank readings.
 * Leak Sentinel looks for abrupt unexplained level drops while the pump is off.
 */

export function litersFromPercentage(percentage, capacityLiters) {
  return Math.round((percentage / 100) * capacityLiters);
}

export function analyzeInsights(readings = [], prefs = {}) {
  const capacity = prefs.tankCapacityLiters || 5000;
  const budget = prefs.dailyBudgetLiters || 450;
  const ordered = [...readings].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  if (ordered.length < 2) {
    return {
      leakRisk: 12,
      leakLabel: "Low",
      refillHours: null,
      usageRateLitersPerHour: 0,
      usedTodayLiters: 0,
      budgetLiters: budget,
      budgetUsedPct: 0,
      trend: "stable",
      events: [],
      forecastNote: "Need more readings to forecast refill timing.",
    };
  }

  const events = [];
  let dropSum = 0;
  let dropHours = 0;
  let suddenDrops = 0;

  for (let i = 1; i < ordered.length; i += 1) {
    const prev = ordered[i - 1];
    const curr = ordered[i];
    const hours =
      (new Date(curr.createdAt) - new Date(prev.createdAt)) / (1000 * 60 * 60) ||
      0.5;
    const deltaPct = curr.waterLevelPercentage - prev.waterLevelPercentage;
    const deltaLiters = litersFromPercentage(Math.abs(deltaPct), capacity);

    if (deltaPct < 0 && !curr.pumpStatus) {
      dropSum += deltaLiters;
      dropHours += hours;
      const dropPerHour = deltaLiters / hours;
      if (dropPerHour > 80) {
        suddenDrops += 1;
        events.push({
          id: `drop-${curr.id}`,
          type: "sudden_drop",
          message: `Sudden ${Math.round(deltaPct * -1)}% drop without pump activity`,
          at: curr.createdAt,
        });
      }
    }
  }

  const usageRate = dropHours > 0 ? dropSum / dropHours : 0;
  const latest = ordered[ordered.length - 1];
  const first = ordered[0];
  const windowHours =
    (new Date(latest.createdAt) - new Date(first.createdAt)) / (1000 * 60 * 60) ||
    1;
  const netDropPct = Math.max(0, first.waterLevelPercentage - latest.waterLevelPercentage);
  const usedTodayLiters = Math.round(
    litersFromPercentage(netDropPct, capacity) * Math.min(24 / windowHours, 1.4),
  );

  let leakRisk = 10 + suddenDrops * 28 + Math.min(usageRate / 4, 35);
  if (prefs.guardMode) leakRisk += 8;
  if (prefs.leakSensitivity === "strict") leakRisk += 10;
  if (prefs.leakSensitivity === "relaxed") leakRisk -= 8;
  leakRisk = Math.max(5, Math.min(96, Math.round(leakRisk)));

  const leakLabel =
    leakRisk >= 70 ? "Elevated" : leakRisk >= 40 ? "Watch" : "Low";

  const currentLiters = litersFromPercentage(latest.waterLevelPercentage, capacity);
  const refillHours =
    usageRate > 5 ? Math.round((currentLiters / usageRate) * 10) / 10 : null;

  const trend =
    latest.waterLevelPercentage - first.waterLevelPercentage > 4
      ? "rising"
      : latest.waterLevelPercentage - first.waterLevelPercentage < -4
        ? "falling"
        : "stable";

  return {
    leakRisk,
    leakLabel,
    refillHours,
    usageRateLitersPerHour: Math.round(usageRate * 10) / 10,
    usedTodayLiters,
    budgetLiters: budget,
    budgetUsedPct: Math.min(100, Math.round((usedTodayLiters / budget) * 100)),
    trend,
    events,
    forecastNote:
      refillHours == null
        ? "Usage is too low to project an empty-tank time."
        : refillHours < 12
          ? "Tank may need attention within the next shift."
          : "Supply looks comfortable at the current draw rate.",
    currentLiters,
    capacity,
  };
}
