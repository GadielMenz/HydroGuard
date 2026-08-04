export default function SensorStatus({ name, online, value }) {
  return (
    <article className="card status-row">
      <div>
        <strong>{name}</strong>
        <p>{value}</p>
      </div>
      <span className={`dot-label ${online ? "online" : "offline"}`}>
        <span /> {online ? "ONLINE" : "OFFLINE"}
      </span>
    </article>
  );
}
