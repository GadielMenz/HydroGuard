import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/api";
import { getPrefs, savePrefs } from "../../services/userStore";

const tabs = [
  ["system", "System"],
  ["tank", "Tank"],
  ["alerts", "Alerts"],
  ["guard", "Guard Mode"],
];

export default function SettingsPanel() {
  const [tab, setTab] = useState("system");
  const [settings, setSettings] = useState({
    lowThreshold: 30,
    highThreshold: 80,
    pumpMode: "AUTOMATIC",
    buzzerEnabled: true,
  });
  const [prefs, setPrefs] = useState(getPrefs);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  function updateSetting(field, value) {
    setSaved("");
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updatePref(field, value) {
    setSaved("");
    setPrefs((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextSettings = await updateSettings(settings);
    setSettings(nextSettings);
    savePrefs(prefs);
    setSaved("Settings saved.");
  }

  return (
    <form className="settings-shell" onSubmit={handleSubmit}>
      <div className="settings-tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            className={`settings-tab ${tab === id ? "active" : ""}`}
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card form-card form-card-wide">
        {tab === "system" && (
          <>
            <h2>Pump &amp; thresholds</h2>
            <p className="muted-copy">
              Core controller behavior for automatic refill and buzzer triggers.
            </p>
            <div className="form-row-split">
              <label>
                Low water threshold (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.lowThreshold}
                  onChange={(e) => updateSetting("lowThreshold", Number(e.target.value))}
                />
              </label>
              <label>
                High water threshold (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.highThreshold}
                  onChange={(e) => updateSetting("highThreshold", Number(e.target.value))}
                />
              </label>
            </div>
            <label>
              Pump mode
              <select
                value={settings.pumpMode}
                onChange={(e) => updateSetting("pumpMode", e.target.value)}
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.buzzerEnabled}
                onChange={(e) => updateSetting("buzzerEnabled", e.target.checked)}
              />
              Enable buzzer alerts on the controller
            </label>
          </>
        )}

        {tab === "tank" && (
          <>
            <h2>Tank configuration</h2>
            <p className="muted-copy">
              Used by Tank Twin, refill forecast, and water budget calculations.
            </p>
            <div className="form-row-split">
              <label>
                Capacity (liters)
                <input
                  type="number"
                  min="100"
                  value={prefs.tankCapacityLiters}
                  onChange={(e) =>
                    updatePref("tankCapacityLiters", Number(e.target.value))
                  }
                />
              </label>
              <label>
                Height (cm)
                <input
                  type="number"
                  min="20"
                  value={prefs.tankHeightCm}
                  onChange={(e) => updatePref("tankHeightCm", Number(e.target.value))}
                />
              </label>
            </div>
            <div className="form-row-split">
              <label>
                Daily water budget (liters)
                <input
                  type="number"
                  min="10"
                  value={prefs.dailyBudgetLiters}
                  onChange={(e) =>
                    updatePref("dailyBudgetLiters", Number(e.target.value))
                  }
                />
              </label>
              <label>
                Display units
                <select
                  value={prefs.units}
                  onChange={(e) => updatePref("units", e.target.value)}
                >
                  <option value="metric">Metric (L, cm)</option>
                  <option value="imperial">Imperial (gal, in)</option>
                </select>
              </label>
            </div>
          </>
        )}

        {tab === "alerts" && (
          <>
            <h2>Notification channels</h2>
            <p className="muted-copy">
              Choose how HydroGuard reaches you when levels cross thresholds.
            </p>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={prefs.emailAlerts}
                onChange={(e) => updatePref("emailAlerts", e.target.checked)}
              />
              Email alerts
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={prefs.smsAlerts}
                onChange={(e) => updatePref("smsAlerts", e.target.checked)}
              />
              SMS alerts
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={prefs.pushAlerts}
                onChange={(e) => updatePref("pushAlerts", e.target.checked)}
              />
              Browser push alerts
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={prefs.weeklyDigest}
                onChange={(e) => updatePref("weeklyDigest", e.target.checked)}
              />
              Weekly water usage digest
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={prefs.quietHoursEnabled}
                onChange={(e) => updatePref("quietHoursEnabled", e.target.checked)}
              />
              Enable quiet hours
            </label>
            {prefs.quietHoursEnabled && (
              <div className="form-row-split">
                <label>
                  Quiet hours start
                  <input
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) => updatePref("quietHoursStart", e.target.value)}
                  />
                </label>
                <label>
                  Quiet hours end
                  <input
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) => updatePref("quietHoursEnd", e.target.value)}
                  />
                </label>
              </div>
            )}
          </>
        )}

        {tab === "guard" && (
          <>
            <h2>Guard Mode</h2>
            <p className="muted-copy">
              HydroGuard&apos;s night-watch layer — raises Leak Sentinel sensitivity
              and prioritizes sudden unexplained drops.
            </p>
            <label className="checkbox-row guard-toggle">
              <input
                type="checkbox"
                checked={prefs.guardMode}
                onChange={(e) => updatePref("guardMode", e.target.checked)}
              />
              <span>
                <strong>Enable Guard Mode</strong>
                <small>Recommended overnight or when the site is unmanned.</small>
              </span>
            </label>
            <label>
              Leak sensitivity
              <select
                value={prefs.leakSensitivity}
                onChange={(e) => updatePref("leakSensitivity", e.target.value)}
              >
                <option value="relaxed">Relaxed</option>
                <option value="balanced">Balanced</option>
                <option value="strict">Strict</option>
              </select>
            </label>
            <div className="banner-callout subtle">
              <strong>How it works</strong>
              <span>
                When Guard Mode is on, Insights weights idle-tank drops more heavily
                and surfaces Sentinel events sooner on the dashboard.
              </span>
            </div>
          </>
        )}

        <div className="settings-actions">
          <button type="submit">Save settings</button>
          {saved && <p className="success-text">{saved}</p>}
        </div>
      </div>
    </form>
  );
}
