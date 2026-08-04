import { useEffect, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import Loading from "../components/common/Loading";
import { getAlerts } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  if (!alerts) return <Loading label="Loading alerts" />;

  return (
    <section className="page-stack hg-page">
      <header className="hg-pagehead">
        <div>
          <p className="hg-eyebrow">Notifications</p>
          <h1>Alerts</h1>
          <p>Low-water, high-water, pump, and controller communication events.</p>
        </div>
      </header>
      <div className="hg-grid hg-grid-2">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </section>
  );
}
