import { useEffect, useState } from "react";
import DeviceStatus from "../components/monitoring/DeviceStatus";
import SensorStatus from "../components/monitoring/SensorStatus";
import Loading from "../components/common/Loading";
import { getCurrentStatus, turnPumpOff, turnPumpOn } from "../services/api";
import { formatDateTime } from "../utils/waterLevel";

export default function Monitoring() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getCurrentStatus().then(setStatus);
  }, []);

  async function setPump(running) {
    setStatus(running ? await turnPumpOn() : await turnPumpOff());
  }

  if (!status) return <Loading label="Loading monitoring data" />;

  const online = status.deviceStatus === "ONLINE";

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <h1>Live Monitoring</h1>
          <p>Detailed current state for the sensor, relay, pump, buzzer, and controller.</p>
        </div>
        <span className={`dot-label ${online ? "online" : "offline"}`}>
          <span /> {status.deviceStatus}
        </span>
      </div>
      <div className="list-grid two-columns">
        <SensorStatus
          name="Ultrasonic sensor"
          online={online}
          value={`${status.distanceCm} cm distance to water`}
        />
        <DeviceStatus
          name="Water level"
          status={status.waterStatus}
          detail={`${status.waterLevelPercentage}% full`}
        />
        <DeviceStatus
          name="Relay"
          status={status.pumpStatus ? "ACTIVE" : "IDLE"}
          detail="Controls the submersible pump power circuit."
        />
        <DeviceStatus
          name="Pump"
          status={status.pumpStatus ? "RUNNING" : "OFF"}
          detail={`Mode: ${status.pumpMode}`}
        />
        <DeviceStatus
          name="Buzzer"
          status={status.buzzerStatus ? "ACTIVE" : "INACTIVE"}
          detail={status.buzzerEnabled ? "Buzzer alerts enabled." : "Buzzer alerts disabled."}
        />
        <DeviceStatus
          name="Last communication"
          status={status.deviceStatus}
          detail={formatDateTime(status.lastSeen)}
        />
      </div>
      {status.pumpMode === "MANUAL" && (
        <div className="card action-card">
          <strong>Manual pump control</strong>
          <div>
            <button onClick={() => setPump(true)}>Turn pump on</button>
            <button className="secondary-button" onClick={() => setPump(false)}>
              Turn pump off
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
