import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../services/userStore";

export default function Login() {
  const navigate = useNavigate();
  const existing = getProfile();
  const [email, setEmail] = useState(existing.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter both email and password to continue.");
      return;
    }

    setLoading(true);
    // Stub auth — wire to Supabase Auth in a later phase
    window.setTimeout(() => {
      saveProfile({ email: email.trim() });
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
          <h1>Protect every drop you manage</h1>
          <p>
            Live tank levels, pump control, and alerts in one calm control surface for
            your water system.
          </p>
          <ul className="hg-auth-points">
            <li>Real-time level and pump telemetry</li>
            <li>Leak Sentinel scoring on unexplained drops</li>
            <li>Threshold alerts by email, SMS, and push</li>
          </ul>
        </div>
        <p className="hg-auth-foot">Monitor · Protect · Manage</p>
      </section>

      <section className="hg-auth-panel">
        <div className="hg-auth-card">
          <div>
            <p className="hg-eyebrow">Welcome back</p>
            <h1>Sign in</h1>
            <p className="hg-note">Access your HydroGuard dashboard.</p>
          </div>

          <form className="hg-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <p className="hg-error" role="alert">
                {error}
              </p>
            )}
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="hg-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="hg-switch">
            New to HydroGuard? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
