import { Split } from "lucide-react";

type DisplayBrancheProps = {
  branche: string;
};

export default function DisplayBranche({ branche }: DisplayBrancheProps) {
  return (
    <div className="flex gap-x-2 border p-2 rounded-2xl shadow  border-gray-300 hover:shadow-lg">
      <Split />
      <span className="font-bold">{branche ? branche : "Aucune branche"}</span>
    </div>
  );
}
