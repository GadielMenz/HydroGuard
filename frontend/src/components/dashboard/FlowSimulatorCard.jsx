import { useState } from "react";
import { simulateWaterDraw, simulateRefillTarget, turnPumpOn, turnPumpOff } from "../../services/api";

export default function FlowSimulatorCard({ onUpdate }) {
  const [loadingAction, setLoadingAction] = useState(null);

  async function handleDrain() {
    setLoadingAction("drain");
    try {
      const result = simulateWaterDraw(25);
      onUpdate(result.status, result.history);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleRefill() {
    setLoadingAction("refill");
    try {
      const result = simulateRefillTarget(80);
      onUpdate(result.status, result.history);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handlePumpToggle(on) {
    setLoadingAction(on ? "pumpOn" : "pumpOff");
    try {
      const status = on ? await turnPumpOn() : await turnPumpOff();
      onUpdate(status);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <article className="card flow-simulator-card">
      <div className="simulator-header">
        <div>
          <p className="eyebrow">Interactive Simulator</p>
          <h2>Test Refill & Draw Sequences</h2>
          <p className="muted-copy">
            Simulate water usage dropping tank levels or trigger automatic pumping from the reservoir into the tank.
          </p>
        </div>
        <span className="pill status-running">Live Testing</span>
      </div>

      <div className="simulator-actions">
        <button
          className="sim-btn sim-btn-drain"
          onClick={handleDrain}
          disabled={loadingAction !== null}
        >
          <span className="sim-icon">📉</span>
          <div>
            <strong>Simulate Water Consumption</strong>
            <small>Draws tank level down to 25% (Triggers Low Warning)</small>
          </div>
        </button>

        <button
          className="sim-btn sim-btn-refill"
          onClick={handleRefill}
          disabled={loadingAction !== null}
        >
          <span className="sim-icon">💧</span>
          <div>
            <strong>Pumping Water from Reservoir</strong>
            <small>Refills tank from reservoir up to 80% capacity</small>
          </div>
        </button>

        <div className="sim-toggle-group">
          <button
            className="secondary-button"
            onClick={() => handlePumpToggle(true)}
            disabled={loadingAction !== null}
          >
            Turn Pump ON
          </button>
          <button
            className="secondary-button"
            onClick={() => handlePumpToggle(false)}
            disabled={loadingAction !== null}
          >
            Turn Pump OFF
          </button>
        </div>
      </div>
    </article>
  );
}
