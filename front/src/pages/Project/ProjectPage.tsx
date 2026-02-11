import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { api } from "../../libs/axios";
import { useNavigate } from "@tanstack/react-router";
import { Trash } from "lucide-react";

// typage de la ressource Project
type Project = {
	id: number;
	createdAt: string;
	description: string;
	title: string;
};

// typage de la reponse API
type ApiResponse = {
	projects: Project[];
};

// schema de validation des données du formulaire
const schema = z.object({
	title: z.string().min(1, "Un nom est attendu"),
	description: z.string(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
	title: "",
	description: "",
};

export default function ProjectPage() {
	// pour gérer l'update à la création d'un nouveau projet
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// GET: récupération des données
	const {
		// pour éviter le soucis avec tanstack par défaut on passe un tableau vide
		data: projects = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			// on extrait directement la data d'axios et l'objet qui contient les données
			const response = await api.get<ApiResponse>("/projects");
			return response.data.projects; // l'objet est passé dans data qui est ensuite appelé projects pour utilisation dans le composant
		},
	});

	// POST: création d'un nouveau projet
	const {
		mutate,
		isPending,
		error: mutationError,
	} = useMutation({
		mutationFn: async (newProject: FormValues) => {
			// on fait la requête POST
			return await api.post("/projects", newProject);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] }); // invalide le cache pour refaire la requête et reload le listing
			form.reset(); // on vide le formulaire
		},
		onError: (err) => {
			console.error("Erreur lors de la création", err);
		},
	});

	// FORM: validation et soumission
	const form = useForm({
		defaultValues,
		validators: {
			onChange: schema,
		},
		onSubmit: async ({ value }) => {
			mutate(value);
		},
	});

	// DELETE: suppression d'un projet
	const deleteMutation = useMutation({
		mutationFn: async (projectId: number) => {
			return await api.delete(`/projects/${projectId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: (err) => {
			console.error("Failed to delete project : ", err);
		},
	});

	// définition des colonnes
	const columnHelper = createColumnHelper<Project>();

	const columns = [
		columnHelper.accessor("id", {
			header: "ID",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("title", {
			header: "Nom du projet",
			cell: (info) => <span className="font-bold">{info.getValue()}</span>,
		}),
		columnHelper.accessor("description", {
			header: "Description",
			cell: (info) => info.getValue() || "Pas de description",
		}),
		columnHelper.accessor("createdAt", {
			header: "Créé le",
			cell: (info) => new Date(info.getValue()).toLocaleDateString(),
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

	// 3. Initialisation de la table
	const table = useReactTable({
		data: projects ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="border container mx-auto pt-10">
			<form
				className="w-200 mx-auto flex flex-col gap-y-5 py-6"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field
					name="title"
					children={(field) => (
						<div className="flex items-center input w-full">
							<label htmlFor="name">Nom :</label>
							<input
								type="text"
								id="name"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				/>

				<form.Field
					name="description"
					children={(field) => (
						<div className="flex flex-col gap-1 w-full p-2 textarea">
							<label htmlFor="">Description :</label>
							<textarea
								className="w-full"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							></textarea>
						</div>
					)}
				/>

				{mutationError && (
					<div className="bg-red-500 font-bold italic">Erreur serveur</div>
				)}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<div className="flex justify-center gap-x-5">
							<button
								type="button"
								className="btn btn-neutral"
								onClick={() => {
									form.reset();
								}}
							>
								Effacer
							</button>

							<button
								type="submit"
								disabled={!canSubmit}
								className="btn btn-primary"
							>
								{isPending || isSubmitting ? "Envoie ..." : "Créer"}
							</button>
						</div>
					)}
				/>
			</form>
			<div className="">
				<h2>Mes projets</h2>
				{isLoading && <p>Chargement des données ...</p>}
				{isError && (
					<p>
						Erreur lors de la récupération des données: {(error as any).message}
					</p>
				)}

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
											to: `/projects/$projectId`,
											params: { projectId: row.original.id },
										})
									}
									className="hover:bg-gray-50 cursor-pointer transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="p-3 border-b text-sm">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>

					{projects.length === 0 && (
						<p className="p-4 text-center text-gray-500">
							Aucun projet trouvé.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
