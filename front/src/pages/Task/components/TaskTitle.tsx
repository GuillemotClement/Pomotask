import { CircleCheck } from "lucide-react";

type TaskTitleProps = {
  title: string;
  statusId: number;
};

const COLORS: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-blue-500",
  4: "text-green-500",
};

export default function TaskTitle({ title, statusId }: TaskTitleProps) {
  const colorClass = COLORS[statusId] || "text-gray-300";
  return (
    <div className="mx-auto flex gap-x-3 text-3xl my-4 items-center">
      <CircleCheck className={colorClass} />
      <div className={colorClass}>{title}</div>
    </div>
  );
}
