export default function SystemStatusCard({ online = false, lastSeen = "" }) {
  return (
    <article className="card metric-card">
      <p className="eyebrow">Controller</p>
      <strong className="metric">{online ? "ONLINE" : "OFFLINE"}</strong>
      <p>Last communication: {lastSeen}</p>
      <span className={`dot-label ${online ? "online" : "offline"}`}>
        <span /> {online ? "Healthy link" : "Check device"}
      </span>
    </article>
  );
}
