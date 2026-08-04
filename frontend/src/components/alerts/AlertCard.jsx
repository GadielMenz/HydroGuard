import { formatDateTime, severityClass } from "../../utils/waterLevel";

export default function AlertCard({ severity = "INFO", title, type, message, time, createdAt, resolved }) {
  return (
    <article className={`card alert-card ${severityClass(severity)}`}>
      <div>
        <strong>{title || type}</strong>
        <span className="pill">{severity}</span>
      </div>
      <p>{message}</p>
      <small>
        {formatDateTime(time || createdAt)} · {resolved ? "Resolved" : "Open"}
      </small>
    </article>
  );
}
