export default function TankTwin({
  percentage = 0,
  status = "NORMAL",
  capacityLiters = 5000,
  currentLiters,
  pumpStatus = false,
  flow,
}) {
  const level = Math.min(Math.max(percentage, 0), 100);
  const liters =
    currentLiters ?? Math.round((level / 100) * capacityLiters);

  const isRefilling = pumpStatus || flow?.type === "REFILL";
  const isUsage = !isRefilling && flow?.type === "USAGE";

  return (
    <article className="card tank-twin">
      <div className="tank-twin-copy">
        <p className="eyebrow">Tank Twin</p>
        <h2>Live storage tank model</h2>
        <p>
          Real-time vessel monitor showing water level, top refill pumping from
          reservoir, and bottom water usage.
        </p>

        <div className="tank-twin-stats">
          <div>
            <strong>{level}%</strong>
            <span>Fill level</span>
          </div>
          <div>
            <strong>{liters.toLocaleString()} L</strong>
            <span>Estimated volume</span>
          </div>
          <div>
            <strong className={`pill status-${status.toLowerCase()}`}>{status}</strong>
            <span>Level status</span>
          </div>
        </div>

        <div className="flow-mode-banner">
          {isRefilling ? (
            <div className="flow-banner-item refill">
              <span className="pump-pulse-dot" />
              <div>
                <strong>Refill Pump RUNNING</strong>
                <p>Pumping water from reservoir into storage tank top inlet</p>
              </div>
            </div>
          ) : isUsage ? (
            <div className="flow-banner-item usage">
              <span className="usage-pulse-dot" />
              <div>
                <strong>Water in Use</strong>
                <p>Drawing water from bottom outlet for consumption</p>
              </div>
            </div>
          ) : (
            <div className="flow-banner-item idle">
              <span className="idle-dot" />
              <div>
                <strong>Pumping Idle</strong>
                <p>No active refill or draw detected</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tank-visual-container">
        {/* Top Inflow Pipe (Reservoir -> Tank) */}
        <div className={`tank-pipe top-inflow ${isRefilling ? "active-flow" : ""}`}>
          <span className="pipe-label">From Reservoir</span>
          <div className="pipe-line top-line">
            {isRefilling && <span className="water-flow-particle particle-down" />}
          </div>
          {isRefilling && <div className="inflow-splash-stream" />}
        </div>

        <div className="tank-visual" aria-hidden="true">
          <div className="tank-shell">
            <div className="tank-water" style={{ height: `${level}%` }}>
              <span className="tank-wave" />
              <span className="tank-wave tank-wave-delay" />
              {isRefilling && <span className="refill-ripples" />}
            </div>
            <div className="tank-marks">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
          </div>
          <p className="tank-caption">{capacityLiters.toLocaleString()} L capacity</p>
        </div>

        {/* Bottom Outflow Pipe (Tank -> Outlets) */}
        <div className={`tank-pipe bottom-outflow ${isUsage ? "active-flow" : ""}`}>
          <div className="pipe-line bottom-line">
            {isUsage && <span className="water-flow-particle particle-right" />}
          </div>
          <span className="pipe-label">To Outlets / Use</span>
        </div>
      </div>
    </article>
  );
}
