export default function WaterLevelCard({ percentage = 0, levelCm = 0, status = "UNKNOWN" }) {
  return (
    <article className="card metric-card">
      <div>
        <p className="eyebrow">Water Level</p>
        <strong className="metric">{percentage}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }} />
      </div>
      <p>{levelCm} cm from sensor</p>
      <span className={`pill status-${status.toLowerCase()}`}>{status}</span>
    </article>
  );
}
