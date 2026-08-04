export default function StatusIndicator({ status = "NORMAL" }) {
  return <span className={`pill status-${status.toLowerCase()}`}>{status}</span>;
}
