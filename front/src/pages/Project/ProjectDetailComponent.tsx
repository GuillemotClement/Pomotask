import { useQuery } from "@tanstack/react-query";
import { projectDetailRoute } from "../../router/router";
import { api } from "../../libs/axios";

export default function ProjectDetailComponent() {
	// TanStack Router sait que projectId est une string grâce à la définition du path
	const { projectId } = projectDetailRoute.useParams();

	// On utilise ensuite cet ID pour fetcher les données spécifiques
	const { data: project, isLoading } = useQuery({
		queryKey: ["projects", projectId],
		queryFn: () => api.get(`/projects/${projectId}`).then((res) => res.data),
	});

	if (isLoading) return <p>Chargement du projet {projectId}...</p>;

	return (
		<div>
			<h1>{project.title}</h1>
			<p>{project.description}</p>
		</div>
	);
}
