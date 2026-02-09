<script lang="ts">
	import Loader from "../../components/Loader.svelte";
	import { apiHook } from "../../hooks/apiHook";
	import { dateUtils } from "../../utils/dateUtils";
	import type { Project } from "../../types/project";
	import { api } from "../../lib/axios";

	type Task = {
		id: number;
		title: string;
		description: string;
		status: string;
		statusId: number;
		branche: string;
		projectId: number;
		project: string;
		createdAt: string;
	}

	type Status = {
		id: number;
		title: string;
	}

	let tasks: Task[] = $state([]);
	let error = $state<string | null>(null);
	let isLoading = $state(true);

	let selectedProjectId = $state("");

	const loadTasks = async (projectId: string | number = "") => {
		isLoading = true;
		error = null;

		let endpoint = "/tasks";

		if(projectId){
			endpoint += `/${projectId}`;
		}

		try{
			const res= await apiHook.getAll<{ tasks: Task[]}>(endpoint);

			if(!res){
				throw new Error("Echec de récupération des tâches")
			}
			tasks = res.tasks;
		}catch(err){
			console.error(err);
			error = "Echec de la récupération des tâches";
		}finally {
			isLoading = false;
		}
	}

	let projects: Project[] = $state([]);
	let projectIsLoading = $state(true);
	let projectError = $state<string | null>(null);

	const loadProject = async () => {
		projectIsLoading = true;
		projectError = null;

		try {
			const res = await apiHook.getAll<{ projects: Project[]}>('/projects');

			if(!res){
				throw new Error("Echec de récupération des projets");
			}
			projects = res.projects;

		}catch(err){
			console.error(err);
			projectError = "Echec de récupération des projets"
		}finally {
			projectIsLoading = false;
		}
	}

	const deleteTask = async (task: Task) => {
		if(confirm("Confirmer la suppression de la tâche")) {
			try{
				await api.delete(`/tasks/${task.id}`)
				loadTasks();
			}catch(err){
				console.error(err);
			}
		}
	}

	const updateStatusTask = async (task: Task) => {
		
		const payload = {
			statusId: task.statusId
		}

		try {
			await api.patch(`/tasks/status/${task.id}`, payload);
			await loadTasks();
		}catch(err){
			console.error(err);
		}
	}

	let status: Status[] = $state([]);
	let statusIsLoading = $state(true);
	let statustError = $state<string | null>(null);

	const loadStatus = async () => {
		statusIsLoading = true;
		statustError = null;

		try{
			const res= await apiHook.getAll<{ status: Status[]}>("/status-task");

			if(!res){
				throw new Error("Echec de récupération des status")
			}
			status = res.status;
		}catch(err){
			console.error(err);
			error = "Echec de la récupération des status";
		}finally {
			isLoading = false;
		}
	}

	$effect(() => {
		loadTasks(selectedProjectId);
	})


	$effect(() => {
		loadProject();
		loadStatus();
	})

</script>

<div class="">

	{#if isLoading}
		<Loader />
		{:else if error}
			<p>{error}</p>
		{:else}

	<div class="tasks-filter">
		<div class="">
			<select name="" id="" bind:value={selectedProjectId}>
				<option value="">Tous</option>
				<!-- TODO: au changement, on charge que les task qui correspondent -->
				 <!-- TODO: passer au valeur pour éviter valeur null pour le projet, type autre-->
				{#each projects as project}
					<option value={project.id}>{project.title}</option>
				{/each}
			</select>
		</div>
		<div class="">
			<button>A faire</button>
			<button>En cours</button>
			<button>Checking</button>
			<button>Terminé</button>
		</div>
	</div>


		<table class="table">
			<thead>
				<tr>
					<th>Nom</th>
					<th>Projet</th>
					<th>Branche</th>
					<th>Date d'ajout</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each tasks as task}
				<tr>
					<td>
						{task.title}
					</td>
					<td>
						{task.project ?? "Autre"}
					</td>
					<th>
						{task.branche ?? "Aucune"}
					</th>
					<td>
						{dateUtils.formatDateFr(task.createdAt)}
					</td>
					<td>
						<select bind:value={task.statusId} onchange={() => updateStatusTask(task)}>
								{#each status as statu }
									<option value={statu.id}>{statu.title}</option>								
								{/each}
							</select>
					</td>
					<td>
						<a href="" class="btn">Détail</a>
						<button class="btn" type="button" onclick={() => deleteTask(task)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
						</button>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
.tasks-filter {
	border: 1px solid red;
	display: flex;
	justify-content: space-between;
}

.row-listing{
	display: flex;
}

table td, th {
	border: 1px solid black;
}


</style>