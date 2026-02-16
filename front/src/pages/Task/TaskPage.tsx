import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CirclePlus, Trash } from "lucide-react";
import { api } from "../../libs/axios";

type Task = {
  id: number;
  title: string;
  branche: string;
  createdAt: string;
  description: string;
  project: string;
  projectId: number;
  status: string;
  statusId: number;
};

type Status = {
  id: number;
  title: string;
};

// typage pour la réposne API
type StatusResponse = {
  status: Status[];
};

type TaskResponse = {
  tasks: Task[];
};

export default function TaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get<TaskResponse>("/tasks");
      return response.data.tasks;
    },
  });

  const { data: taskStatus = [] } = useQuery<Status[]>({
    queryKey: ["taskStatus"],
    queryFn: async () => {
      const res = await api.get<StatusResponse>("/status-task");
      console.log("res");
      console.log(res);
      return res.data.status;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/tasks" });
    },
    onError: (err) => {
      console.error("Failed to delete task : ", err);
    },
  });

  const columnHelper = createColumnHelper<Task>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Nom",
      cell: (info) => <span className="font-bold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("project", {
      header: "Projet",
      cell: (info) => info.getValue() || "Autre",
    }),
    columnHelper.accessor("branche", {
      header: "Branche",
      cell: (info) => info.getValue() || "",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date de création",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("statusId", {
      header: "Status",
      cell: (info) => {
        const currentStatusId = info.getValue();

        return (
          <select
            className="bg-white border border-gray-300 rounded px-2 py-1 outline-none"
            value={currentStatusId}
            // Empêche de naviguer vers la page détail quand on clique sur le select
            onClick={(e) => e.stopPropagation()}
            // Pour l'instant on se contente d'afficher, on peut logger le changement
            onChange={(e) => console.log("Nouveau status ID:", e.target.value)}
          >
            {taskStatus.map((status) => (
              <option value={status.id} key={status.id}>
                {status.title}
              </option>
            ))}
          </select>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Confirmer la supression du projet.")) {
              deleteMutation.mutate(info.row.original.id);
            }
          }}
          className="text-red-500 hover:text-red-700 font-medium"
          type="button"
        >
          <Trash />
        </button>
      ),
    }),
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tasks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto">
      {isLoading && <p>Chargement des données ...</p>}
      {isError && (
        <p>
          Erreur lors de la récupération des tâches : {(error as any).message}
        </p>
      )}

      <div className="">
        <Link to="/tasks/create">
          <CirclePlus />
        </Link>
      </div>

      <div className="mt-8 border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 border-b">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() =>
                  navigate({
                    to: `/tasks/$taskId`,
                    params: { taskId: String(row.original.id) },
                  })
                }
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <p className="p-4 text-center text-gray-500">Aucune taches trouvé.</p>
        )}
      </div>
    </div>
  );
}
