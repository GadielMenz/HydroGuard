import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../services/userStore";
import { getPrefs } from "../services/userStore";

export default function Profile() {
  const [profile, setProfile] = useState(getProfile);
  const [prefs] = useState(getPrefs);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function handleSave(event) {
    event.preventDefault();
    const next = saveProfile(draft);
    setProfile(next);
    setEditing(false);
    setSaved(true);
  }

  function cancelEdit() {
    setDraft(profile);
    setEditing(false);
  }

  return (
    <section className="page-stack hg-page">
      <header className="hg-pagehead">
        <div>
          <p className="hg-eyebrow">Account</p>
          <h1>Profile</h1>
          <p>Your HydroGuard identity, site access, and contact details.</p>
        </div>
        {!editing && (
          <div className="hg-headactions">
            <button type="button" className="hg-btn hg-btn-ghost" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          </div>
        )}
      </header>

      <div className="hg-card hg-profile">
        <span className="hg-avatar" aria-hidden="true">
          {profile.avatarInitials}
        </span>
        <div>
          <p className="hg-eyebrow">{profile.organization}</p>
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <div className="hg-profile-meta">
            <span>{profile.email}</span>
            <span>{profile.location}</span>
            <span>Joined {profile.joinedAt}</span>
          </div>
        </div>
        <div className="hg-profile-badges">
          <span className={`hg-chip ${prefs.guardMode ? "hg-chip-info" : "hg-chip-ok"}`}>
            Guard Mode {prefs.guardMode ? "On" : "Off"}
          </span>
          <span className="hg-chip hg-chip-info">{prefs.units === "metric" ? "Metric" : "Imperial"}</span>
        </div>
      </div>

      {editing ? (
        <form className="hg-card" onSubmit={handleSave}>
          <div className="form-row-split">
            <label>
              Full name
              <input
                value={draft.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </label>
            <label>
              Role
              <input
                value={draft.role}
                onChange={(e) => updateField("role", e.target.value)}
              />
            </label>
          </div>
          <div className="form-row-split">
            <label>
              Email
              <input
                type="email"
                value={draft.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </label>
            <label>
              Phone
              <input
                value={draft.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </label>
          </div>
          <div className="form-row-split">
            <label>
              Organization
              <input
                value={draft.organization}
                onChange={(e) => updateField("organization", e.target.value)}
              />
            </label>
            <label>
              Site location
              <input
                value={draft.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </label>
          </div>
          <label>
            Timezone
            <select
              value={draft.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
            >
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Manila">Asia/Manila</option>
            </select>
          </label>
          <div>
            <button type="submit">Save profile</button>
            <button type="button" className="secondary-button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="hg-grid hg-grid-2">
          <article className="hg-card">
            <p className="hg-eyebrow">Contact</p>
            <h3>Reachability</h3>
            <dl className="hg-dl">
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{profile.phone}</dd>
              </div>
              <div>
                <dt>Timezone</dt>
                <dd>{profile.timezone}</dd>
              </div>
            </dl>
          </article>
          <article className="hg-card">
            <p className="hg-eyebrow">Site access</p>
            <h3>Assigned workspace</h3>
            <dl className="hg-dl">
              <div>
                <dt>Organization</dt>
                <dd>{profile.organization}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Permissions</dt>
                <dd>Monitor, control pump, edit thresholds</dd>
              </div>
            </dl>
          </article>
          <article className="hg-card">
            <p className="hg-eyebrow">Notification snapshot</p>
            <h3>Active channels</h3>
            <ul className="hg-list">
              <li>{prefs.emailAlerts ? "Email alerts on" : "Email alerts off"}</li>
              <li>{prefs.smsAlerts ? "SMS alerts on" : "SMS alerts off"}</li>
              <li>{prefs.pushAlerts ? "Push alerts on" : "Push alerts off"}</li>
              <li>
                {prefs.quietHoursEnabled
                  ? `Quiet hours ${prefs.quietHoursStart}–${prefs.quietHoursEnd}`
                  : "Quiet hours off"}
              </li>
            </ul>
          </article>
        </div>
      )}

      {saved && !editing && <p className="hg-success">Profile updated.</p>}
    </section>
  );
}
