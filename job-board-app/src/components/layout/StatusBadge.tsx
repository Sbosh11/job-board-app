// Purpose: Small badge showing job status (open/closed).
interface Props {
  status: "open" | "closed";
}

export default function StatusBadge({ status }: Props) {
  const styles =
    status === "open"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles}`}>{status}</span>
  );
}
