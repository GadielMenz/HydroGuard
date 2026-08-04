const PROFILE_KEY = "hydroguard.profile";
const PREFS_KEY = "hydroguard.prefs";

const defaultProfile = {
  name: "Alex Rivera",
  email: "admin@hydroguard.local",
  role: "Site Administrator",
  organization: "HydroGuard Demo Site",
  phone: "+1 (555) 014-2088",
  location: "North Tank Yard",
  timezone: "America/Chicago",
  joinedAt: "2025-11-12",
  avatarInitials: "AR",
};

const defaultPrefs = {
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "06:30",
  units: "metric",
  tankCapacityLiters: 5000,
  tankHeightCm: 200,
  dailyBudgetLiters: 450,
  guardMode: false,
  leakSensitivity: "balanced",
  weeklyDigest: true,
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...fallback };
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return { ...fallback };
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getProfile() {
  return read(PROFILE_KEY, defaultProfile);
}

export function saveProfile(profile) {
  const next = { ...getProfile(), ...profile };
  if (next.name) {
    const parts = next.name.trim().split(/\s+/);
    next.avatarInitials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  write(PROFILE_KEY, next);
  window.dispatchEvent(new Event("hydroguard-profile"));
  return next;
}

export function getPrefs() {
  return read(PREFS_KEY, defaultPrefs);
}

export function savePrefs(prefs) {
  const next = write(PREFS_KEY, { ...getPrefs(), ...prefs });
  window.dispatchEvent(new Event("hydroguard-prefs"));
  return next;
}
