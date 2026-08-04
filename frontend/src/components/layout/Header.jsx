import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../services/userStore";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [profile, setProfile] = useState(getProfile);

  useEffect(() => {
    const refresh = () => setProfile(getProfile());
    window.addEventListener("hydroguard-profile", refresh);
    return () => window.removeEventListener("hydroguard-profile", refresh);
  }, []);

  return (
    <header className="topbar">
      <span className="topbar-title">Smart water monitoring &amp; management</span>
      <div className="topbar-actions">
        <ThemeToggle />
        <span className="dot-label online">
          <span /> System online
        </span>
        <Link to="/profile" className="topbar-profile">
          <span className="avatar-chip" aria-hidden="true">
            {profile.avatarInitials}
          </span>
          <span>{profile.name.split(" ")[0]}</span>
        </Link>
      </div>
    </header>
  );
}
