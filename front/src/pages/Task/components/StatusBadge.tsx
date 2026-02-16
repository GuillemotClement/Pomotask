type StatusBadgeProps = {
  id: number;
  title: string;
};

const STATUS_STYLES: Record<number, string> = {
  1: "badge-error",
  2: "badge-warning",
  3: "badge-primary",
  4: "badge-success",
};

export default function StatusBadge({ id, title }: StatusBadgeProps) {
  const colorClass = STATUS_STYLES[id] || "badge-ghost";
  console.log("Classe générée :", `badge badge-soft ${colorClass}`);
  return (
    <div
      className={`badge badge-soft badge-xl shadow hover:shadow-lg ${colorClass}`}
    >
      {title}
    </div>
  );
}
