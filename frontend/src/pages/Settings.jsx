import { Link } from "react-router-dom";
import SettingsPanel from "../components/settings/SettingsPanel";

export default function Settings() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <h1>Settings</h1>
          <p>
            Thresholds, tank geometry, notifications, and Guard Mode — tune how
            HydroGuard watches your water.
          </p>
        </div>
        <Link className="button-link secondary-button" to="/profile" style={{ marginLeft: 0 }}>
          View profile
        </Link>
      </div>
      <SettingsPanel />
    </section>
  );
}
