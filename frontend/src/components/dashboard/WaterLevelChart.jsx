import { formatDateTime } from "../../utils/waterLevel";

export default function WaterLevelChart({ readings = [] }) {
  const points = readings.length ? readings : [{ waterLevelPercentage: 0 }];
  const path = points
    .map((reading, index) => {
      const x = points.length === 1 ? 0 : (index / (points.length - 1)) * 100;
      const y = 100 - Number(reading.waterLevelPercentage || 0);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="card chart-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Trend</p>
          <h2>Water Level History</h2>
        </div>
        <span>{readings.length} readings</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="line-chart">
        <polyline points={path} />
      </svg>
      <div className="chart-labels">
        <span>{formatDateTime(readings[0]?.createdAt)}</span>
        <span>{formatDateTime(readings.at(-1)?.createdAt)}</span>
      </div>
    </section>
  );
}
