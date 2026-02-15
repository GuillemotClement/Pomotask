import { useQuery } from "@tanstack/react-query";
import { api } from "../../libs/axios";

export default function TaskPage() {
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      // on extrait directement la data d'axios et l'objet qui contient les données
      const response = await api.get("/tasks");
      return response.data.tasks; // l'objet est passé dans data qui est ensuite appelé projects pour utilisation dans le composant
    },
  });

  console.log(tasks);

  return (
    <div className="container border mx-auto">
      <h2>Mes tâches</h2>

      {isLoading && <p>Chargement des données ...</p>}
      {isError && (
        <p>
          Erreur lors de la récupération des tâches : {(error as any).message}
        </p>
      )}
    </div>
  );
}
