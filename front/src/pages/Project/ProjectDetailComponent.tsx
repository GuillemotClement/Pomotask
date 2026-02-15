import { useQuery } from "@tanstack/react-query";
import { projectDetailRoute } from "../../router/router";
import { api } from "../../libs/axios";

export default function ProjectDetailComponent() {
  // TanStack Router sait que projectId est une string grâce à la définition du path
  const { projectId } = projectDetailRoute.useParams();

  // On utilise ensuite cet ID pour fetcher les données spécifiques
  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}`);
      return response.data.project;
    },
  });

  console.log(project);
  if (isLoading) return <p>Chargement du projet {projectId}...</p>;

  return (
    <div className="container mx-auto border">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
}
