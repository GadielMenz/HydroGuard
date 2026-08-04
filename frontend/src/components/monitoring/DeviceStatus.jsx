export default function DeviceStatus({ name, status, detail }) {
  return (
    <article className="card status-row">
      <div>
        <strong>{name}</strong>
        <p>{detail}</p>
      </div>
      <span className={`pill status-${String(status).toLowerCase()}`}>{status}</span>
    </article>
  );
}
