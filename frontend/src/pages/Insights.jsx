import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { getWaterHistory, getCurrentStatus } from "../services/api";
import { getPrefs } from "../services/userStore";
import { analyzeInsights, litersFromPercentage } from "../utils/insights";
import { formatDateTime } from "../utils/waterLevel";
import { Link } from "react-router-dom";

export default function Insights() {
  const [status, setStatus] = useState(null);
  const [insights, setInsights] = useState(null);
  const prefs = getPrefs();

  useEffect(() => {
    Promise.all([getCurrentStatus(), getWaterHistory()]).then(
      ([current, history]) => {
        setStatus(current);
        setInsights(analyzeInsights(history, prefs));
      },
    );
  }, []);

  if (!status || !insights) return <Loading label="Calculating insights" />;

  const leakClass =
    insights.leakRisk >= 70
      ? "severity-critical"
      : insights.leakRisk >= 40
        ? "severity-warning"
        : "status-normal";

  return (
    <section className="page-stack hg-page">
      <header className="hg-pagehead">
        <div>
          <p className="hg-eyebrow">Intelligence</p>
          <h1>Insights</h1>
          <p>
            Leak Sentinel, refill forecast, and water budget — unique HydroGuard
            intelligence from your tank history.
          </p>
        </div>
        <div className="hg-headactions">
          <Link className="hg-btn hg-btn-ghost" to="/settings">
            Tune sensitivity
          </Link>
        </div>
      </header>

      {prefs.guardMode && (
        <div className="banner-callout">
          <strong>Guard Mode is active</strong>
          <span>
            Night-watch sensitivity is raised. Leak Sentinel weights sudden drops
            more heavily until you turn it off in Settings.
          </span>
        </div>
      )}

      <div className="hg-grid">
        <article className="hg-card">
          <p className="hg-eyebrow">Leak Sentinel</p>
          <strong className="hg-metric">{insights.leakRisk}</strong>
          <span className={`hg-chip ${leakClass === "severity-critical" ? "hg-chip-danger" : leakClass === "severity-warning" ? "hg-chip-warn" : "hg-chip-ok"}`}>{insights.leakLabel} risk</span>
          <p>
            Scores unexplained level drops while the pump is idle
            {prefs.leakSensitivity ? ` · ${prefs.leakSensitivity} sensitivity` : ""}.
          </p>
        </article>

        <article className="hg-card">
          <p className="hg-eyebrow">Refill forecast</p>
          <strong className="hg-metric">
            {insights.refillHours == null ? "—" : `${insights.refillHours}h`}
          </strong>
          <span className="hg-chip hg-chip-info">
            {insights.usageRateLitersPerHour} L/h draw
          </span>
          <p>{insights.forecastNote}</p>
        </article>

        <article className="hg-card">
          <p className="hg-eyebrow">Water budget</p>
          <strong className="hg-metric">{insights.budgetUsedPct}%</strong>
          <div className="hg-meter">
            <span style={{ width: `${insights.budgetUsedPct}%` }} />
          </div>
          <p>
            ~{insights.usedTodayLiters} L of {insights.budgetLiters} L daily budget
            used · trend {insights.trend}
          </p>
        </article>
      </div>

      <div className="hg-grid hg-grid-2">
        <article className="hg-card">
          <div className="hg-cardhead">
            <h2>Supply snapshot</h2>
          </div>
          <dl className="hg-dl">
            <div>
              <dt>Current volume</dt>
              <dd>
                {litersFromPercentage(
                  status.waterLevelPercentage,
                  prefs.tankCapacityLiters,
                ).toLocaleString()}{" "}
                L ({status.waterLevelPercentage}%)
              </dd>
            </div>
            <div>
              <dt>Tank capacity</dt>
              <dd>{prefs.tankCapacityLiters.toLocaleString()} L</dd>
            </div>
            <div>
              <dt>Tank height</dt>
              <dd>{prefs.tankHeightCm} cm</dd>
            </div>
            <div>
              <dt>Last sensor ping</dt>
              <dd>{formatDateTime(status.lastSeen)}</dd>
            </div>
          </dl>
        </article>

        <article className="hg-card">
          <div className="hg-cardhead">
            <h2>Sentinel events</h2>
          </div>
          {insights.events.length === 0 ? (
            <p className="hg-note">
              No sudden unexplained drops in the recent window. Looking healthy.
            </p>
          ) : (
            <ul className="hg-events">
              {insights.events.map((event) => (
                <li key={event.id}>
                  <strong>{event.message}</strong>
                  <span>{formatDateTime(event.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
