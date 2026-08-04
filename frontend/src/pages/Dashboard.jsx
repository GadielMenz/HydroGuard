import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WaterLevelCard from "../components/dashboard/WaterLevelCard";
import PumpStatusCard from "../components/dashboard/PumpStatusCard";
import SystemStatusCard from "../components/dashboard/SystemStatusCard";
import WaterLevelChart from "../components/dashboard/WaterLevelChart";
import TankTwin from "../components/dashboard/TankTwin";
import FlowSimulatorCard from "../components/dashboard/FlowSimulatorCard";
import AlertCard from "../components/alerts/AlertCard";
import Loading from "../components/common/Loading";
import { getAlerts, getCurrentStatus, getWaterHistory } from "../services/api";
import { getPrefs } from "../services/userStore";
import { analyzeInsights } from "../utils/insights";
import { formatDateTime, getFlowState } from "../utils/waterLevel";

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);
  const prefs = getPrefs();

  useEffect(() => {
    Promise.all([getCurrentStatus(), getWaterHistory(), getAlerts()]).then(
      ([currentStatus, readings, alertList]) => {
        setStatus(currentStatus);
        setHistory(readings);
        setAlerts(alertList);
        setInsights(analyzeInsights(readings, prefs));
      },
    );
  }, []);

  function handleSimulationUpdate(newStatus, newHistory) {
    if (newStatus) setStatus(newStatus);
    if (newHistory) {
      setHistory(newHistory);
      setInsights(analyzeInsights(newHistory, prefs));
    }
  }

  if (!status) return <Loading label="Loading dashboard" />;

  const prevReading = history.length > 1 ? history[history.length - 2] : null;
  const flow = getFlowState(
    {
      waterLevelPercentage: status.waterLevelPercentage,
      pumpStatus: status.pumpStatus,
    },
    prevReading,
    { lowThreshold: status.lowThreshold, highThreshold: status.highThreshold },
  );

  return (
    <section className="page-stack hg-page">
      <header className="hg-hero">
        <div>
          <p className="hg-eyebrow">HydroGuard overview</p>
          <h1>Water system at a glance</h1>
          <p>
            Live storage tank level, reservoir refill pumping activity, and
            controller health.
          </p>
          <div className="hg-profile-meta">
            <span>Updated {formatDateTime(status.lastSeen)}</span>
            <span>
              Thresholds {status.lowThreshold}% – {status.highThreshold}%
            </span>
            <span>Pump mode {status.pumpMode}</span>
          </div>
        </div>
        <div className="hg-hero-badges">
          {prefs.guardMode && <span className="hg-chip hg-chip-info hg-chip-live">Guard Mode</span>}
          <span className={`hg-chip hg-chip-live ${status.deviceStatus === "ONLINE" ? "hg-chip-ok" : "hg-chip-danger"}`}>
            System {status.deviceStatus}
          </span>
          <span className={`hg-chip ${status.pumpStatus ? "hg-chip-info" : "hg-chip-plain"}`}>
            Pump {status.pumpStatus ? "running" : "off"}
          </span>
        </div>
      </header>

      <div className="hg-grid">
        <WaterLevelCard
          percentage={status.waterLevelPercentage}
          levelCm={status.distanceCm}
          status={status.waterStatus}
        />
        <PumpStatusCard
          running={status.pumpStatus}
          mode={status.pumpMode}
          flow={flow}
          waterStatus={status.waterStatus}
        />
        <SystemStatusCard
          online={status.deviceStatus === "ONLINE"}
          lastSeen={formatDateTime(status.lastSeen)}
        />
      </div>

      <div className="hg-grid hg-grid-2">
        <TankTwin
          percentage={status.waterLevelPercentage}
          status={status.waterStatus}
          capacityLiters={prefs.tankCapacityLiters}
          pumpStatus={status.pumpStatus}
          flow={flow}
        />
      </div>

      <FlowSimulatorCard onUpdate={handleSimulationUpdate} />

      {insights && (
        <div className="hg-strip">
          <article>
            <p className="hg-eyebrow">Leak Sentinel</p>
            <strong>{insights.leakRisk}</strong>
            <span>{insights.leakLabel} risk</span>
          </article>
          <article>
            <p className="hg-eyebrow">Refill ETA</p>
            <strong>{insights.refillHours == null ? "—" : `${insights.refillHours}h`}</strong>
            <span>{insights.usageRateLitersPerHour} L/h draw</span>
          </article>
          <article>
            <p className="hg-eyebrow">Budget used</p>
            <strong>{insights.budgetUsedPct}%</strong>
            <span>
              {insights.usedTodayLiters}/{insights.budgetLiters} L
            </span>
          </article>
          <Link to="/insights" className="hg-strip-link">
            Open Insights →
          </Link>
        </div>
      )}

      <section className="hg-card">
        <div className="hg-cardhead">
          <h2>Water level trend</h2>
          <Link to="/history" className="hg-chip hg-chip-plain hg-chip-info">
            Full history
          </Link>
        </div>
        <WaterLevelChart readings={history} />
      </section>

      <section>
        <div className="hg-pagehead">
          <div>
            <p className="hg-eyebrow">Activity</p>
            <h1 style={{ fontSize: "1.25rem" }}>Recent alerts</h1>
          </div>
          <div className="hg-headactions">
            <Link to="/alerts" className="hg-btn hg-btn-ghost">
              View all
            </Link>
          </div>
        </div>
        <div className="hg-grid hg-grid-2" style={{ marginTop: "1rem" }}>
          {alerts.slice(0, 2).map((alert) => (
            <AlertCard key={alert.id} {...alert} />
          ))}
        </div>
      </section>
    </section>
  );
}
