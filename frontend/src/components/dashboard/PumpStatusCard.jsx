export default function PumpStatusCard({
  running = false,
  mode = "AUTOMATIC",
  flow,
  waterStatus = "NORMAL",
}) {
  const refill = running || flow?.type === "REFILL";

  return (
    <article className="card metric-card">
      <p className="eyebrow">Refill pump</p>
      <strong className="metric">{running ? "RUNNING" : "OFF"}</strong>
      <p>
        {refill
          ? "Drawing water from reservoir into the storage tank."
          : waterStatus === "LOW"
            ? "Tank is low — automatic refill will engage when enabled."
            : "Relay idle. Tank supplies water out through normal use."}
      </p>
      <div className="pump-badges">
        <span className={`pill ${refill ? "flow-refill" : "flow-idle"}`}>
          {refill ? "Reservoir → Tank" : "No refill active"}
        </span>
        <span className="pill">{mode}</span>
      </div>
    </article>
  );
}
