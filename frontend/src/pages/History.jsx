import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import WaterLevelChart from "../components/dashboard/WaterLevelChart";
import { getWaterHistory } from "../services/api";
import { formatDateTime } from "../utils/waterLevel";

export default function History() {
  const [readings, setReadings] = useState(null);

  useEffect(() => {
    getWaterHistory().then(setReadings);
  }, []);

  if (!readings) return <Loading label="Loading history" />;

  return (
    <section className="page-stack hg-page">
      <header className="hg-pagehead">
        <div>
          <p className="hg-eyebrow">Trend review</p>
          <h1>Water Level History</h1>
          <p>Historical readings, distance measurements, and pump/buzzer activity.</p>
        </div>
      </header>
      <section className="hg-card">
        <WaterLevelChart readings={readings} />
      </section>
      <div className="hg-tablewrap">
        <div className="hg-tablescroll">
          <table className="hg-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Water Level</th>
                <th>Distance</th>
                <th>Pump</th>
                <th>Buzzer</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) => (
                <tr key={reading.id}>
                  <td>{formatDateTime(reading.createdAt)}</td>
                  <td>{reading.waterLevelPercentage}%</td>
                  <td>{reading.distanceCm} cm</td>
                  <td>{reading.pumpStatus ? "Running" : "Off"}</td>
                  <td>{reading.buzzerStatus ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
