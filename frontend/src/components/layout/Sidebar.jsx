import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { getProfile } from "../../services/userStore";

const links = [
  ["/", "Dashboard"],
  ["/monitoring", "Monitoring"],
  ["/insights", "Insights"],
  ["/history", "History"],
  ["/alerts", "Alerts"],
  ["/settings", "Settings"],
];

export default function Sidebar() {
  const [profile, setProfile] = useState(getProfile);

  useEffect(() => {
    const refresh = () => setProfile(getProfile());
    window.addEventListener("hydroguard-profile", refresh);
    return () => window.removeEventListener("hydroguard-profile", refresh);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-block">
          <img src="/logo.svg" alt="" width={40} height={40} />
          <div>
            <h2>HydroGuard</h2>
            <p className="sidebar-tagline">Monitor · Protect · Manage</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-profile">
          <span className="avatar-chip" aria-hidden="true">
            {profile.avatarInitials}
          </span>
          <span className="sidebar-profile-text">
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </Link>
        <Link to="/login" className="sidebar-signout">
          Sign out
        </Link>
      </div>
    </aside>
  );
}
