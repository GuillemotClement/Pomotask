import { useQuery } from "@tanstack/react-query";
import { api } from "../../libs/axios";
import { taskDetailRoute } from "../../router/router";
import type { Task, TaskDetailResponse } from "../../types/task";
import StatusBadge from "./components/StatusBadge";
import DisplayBranche from "./components/DisplayBranche";
import DisplayProject from "./components/DisplayProject";
import DisplayDescription from "./components/DisplayDescription";
import TaskTitle from "./components/TaskTitle";

export default function TaskDetailPage() {
  const { taskId } = taskDetailRoute.useParams();

  const {
    data: task,
    isLoading,
    isError,
  } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await api.get<TaskDetailResponse>(`/tasks/${taskId}`);
      return res.data.task;
    },
  });

  if (isLoading) return <p>Chargement des données</p>;

  if (isError || !task) return <p>Erreur lors du récupération de la tâche</p>;

  return (
    <div className="flex flex-col container mx-auto p-5 mt-5 w-200 border border-slate-200 rounded-3xl">
      <TaskTitle title={task.title} statusId={task.statusId} />

      <div className="flex justify-between my-3 items-center">
        <DisplayProject title={task.project} />
        <StatusBadge id={task.statusId} title={task.status} />
        <DisplayBranche branche={task.branche} />
      </div>

      <DisplayDescription description={task.description} />
    </div>
  );
}
