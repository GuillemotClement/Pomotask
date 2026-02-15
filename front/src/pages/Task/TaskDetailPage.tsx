import { useQuery } from "@tanstack/react-query";
import { taskDetailRoute } from "../../router/router";
import { api } from "../../libs/axios";

export default function TaskDetailPage() {
  const { taskId } = taskDetailRoute.useParams();

  const { data: task, isLoading } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data.task;
    },
  });

  console.log(task);
  if (isLoading) return <p>Chargement du projet {taskId}...</p>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
    </div>
  );
}
