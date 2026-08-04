import { flowTypeClass } from "../../utils/waterLevel";

export default function FlowActivityCard({ flow, reservoirLevel, tankLevel }) {
  return (
    <article className="card flow-activity">
      <div className="flow-activity-header">
        <div>
          <p className="eyebrow">Water flow</p>
          <h2>Reservoir ↔ Tank</h2>
          <p className="muted-copy">
            Tracks both directions — refill when low, and usage when water leaves
            the tank.
          </p>
        </div>
        <span className={`pill ${flowTypeClass(flow.type)}`}>{flow.label}</span>
      </div>

      <div className="flow-diagram">
        <div className="flow-node">
          <span className="flow-node-label">Reservoir</span>
          <strong>{reservoirLevel ?? "—"}%</strong>
          <small>Source supply</small>
        </div>

        <div className="flow-path" data-direction={flow.direction}>
          <span className={`flow-arrow flow-arrow-in ${flow.type === "REFILL" ? "active" : ""}`}>
            → Refill
          </span>
          <span className="flow-pump-dot">{flow.type === "REFILL" ? "● Pump ON" : "○ Pump off"}</span>
          <span className={`flow-arrow flow-arrow-out ${flow.type === "USAGE" ? "active" : ""}`}>
            Usage →
          </span>
        </div>

        <div className="flow-node flow-node-tank">
          <span className="flow-node-label">Storage tank</span>
          <strong>{tankLevel ?? "—"}%</strong>
          <small>Monitored level</small>
        </div>
      </div>

      <p className="flow-detail">{flow.detail}</p>
      {flow.trigger && <p className="flow-trigger">{flow.trigger}</p>}
    </article>
  );
}
