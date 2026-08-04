import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/api";

export default function ThresholdForm() {
  const [settings, setSettings] = useState({
    lowThreshold: 30,
    highThreshold: 80,
    pumpMode: "AUTOMATIC",
    buzzerEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  function updateField(field, value) {
    setSaved(false);
    setSettings((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextSettings = await updateSettings(settings);
    setSettings(nextSettings);
    setSaved(true);
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label>
        Low water threshold (%)
        <input
          type="number"
          min="0"
          max="100"
          value={settings.lowThreshold}
          onChange={(event) => updateField("lowThreshold", Number(event.target.value))}
        />
      </label>
      <label>
        High water threshold (%)
        <input
          type="number"
          min="0"
          max="100"
          value={settings.highThreshold}
          onChange={(event) => updateField("highThreshold", Number(event.target.value))}
        />
      </label>
      <label>
        Pump mode
        <select
          value={settings.pumpMode}
          onChange={(event) => updateField("pumpMode", event.target.value)}
        >
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={settings.buzzerEnabled}
          onChange={(event) => updateField("buzzerEnabled", event.target.checked)}
        />
        Enable buzzer alerts
      </label>
      <button type="submit">Save settings</button>
      {saved && <p className="success-text">Settings saved.</p>}
    </form>
  );
}
