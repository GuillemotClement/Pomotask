import { useQuery } from "@tanstack/react-query";
import { api } from "../../libs/axios";
import { taskDetailRoute } from "../../router/router";
import type { Task, TaskDetailResponse } from "../../types/task";

export default function TaskDetailPage() {
  const { taskId } = taskDetailRoute.useParams();

  const {
    data: task,
    isLoading,
    error, // contient l'objet error retourner par le backend => permet d'afficher le message d'erreur serveur
    isError, // bolean qui indique si la requête a réussis
  } = useQuery<Task>({
    // avec taskId on rend le cache unique pour cette task
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await api.get<TaskDetailResponse>(`/tasks/${taskId}`);
      return res.data.task;
    },
  });

  if (isLoading) return <p>Chargement des données</p>;

  if (isError || !task) return <p>Erreur lors du récupération de la tâche</p>;

  return (
    <div className="container mx-auto border">
      {error ?? <p>Message d'erreur : {error}</p>}
      <h1>Titre: {task.title}</h1>
      <p>Description : {task.description}</p>
      <p>Branche : {task.branche}</p>
      <p>Date de création : {task.createdAt}</p>
      <p>Date d'update : {task.updatedAt}</p>
      <p>Projet : {task.project}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}
