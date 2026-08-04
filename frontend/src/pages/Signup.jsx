import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveProfile } from "../services/userStore";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Fill in all required fields to create your account.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // Stub auth — wire to Supabase Auth in a later phase
    window.setTimeout(() => {
      saveProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        role: "Site Operator",
        joinedAt: new Date().toISOString().slice(0, 10),
      });
      setLoading(false);
      navigate("/");
    }, 450);
  }

  return (
    <main className="hg-auth">
      <section className="hg-auth-brand">
        <div className="hg-auth-logo">
          <img src="/logo.svg" alt="HydroGuard" width={44} height={44} />
          <span>HydroGuard</span>
        </div>
        <div className="hg-auth-copy">
          <h1>Start guarding your water system</h1>
          <p>
            Set up your workspace, connect sensors, and get clear visibility
            across tanks and pumps.
          </p>
        </div>
        <p className="hg-auth-foot">Monitor · Protect · Manage</p>
      </section>

      <section className="hg-auth-panel">
        <div className="hg-auth-card">
          <div>
            <p className="hg-eyebrow">Get started</p>
            <h1>Create account</h1>
            <p className="hg-note">Join HydroGuard in under a minute.</p>
          </div>

          <form className="hg-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="hg-error">{error}</p>}
            <label>
              Full name
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Alex Rivera"
                value={form.name}
                onChange={update("name")}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
              />
            </label>
            <div className="hg-formrow">
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update("password")}
                />
                <span className="hg-hint">At least 8 characters</span>
              </label>
              <label>
                Confirm
                <input
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={update("confirm")}
                />
              </label>
            </div>
            <button type="submit" className="hg-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="hg-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
