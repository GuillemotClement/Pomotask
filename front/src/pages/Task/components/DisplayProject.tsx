import { FolderOpenDot } from "lucide-react";

type DisplayProjectProps = {
  title: string | null;
};

export default function DisplayProject({ title }: DisplayProjectProps) {
  return (
    <div className="flex gap-x-2 border p-2 rounded-2xl shadow  border-gray-300 hover:shadow-lg">
      <FolderOpenDot />
      <span>{title ? title : "Autre"}</span>
    </div>
  );
}
