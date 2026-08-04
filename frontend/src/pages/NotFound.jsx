import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="auth-panel" style={{ minHeight: "100vh" }}>
      <section className="auth-card card" style={{ padding: "2rem", textAlign: "center" }}>
        <img
          src="/logo.svg"
          alt=""
          width={48}
          height={48}
          style={{ margin: "0 auto", borderRadius: 12 }}
        />
        <h1>Page not found</h1>
        <p className="auth-lead">That route is not part of HydroGuard.</p>
        <Link className="button-link" to="/">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
