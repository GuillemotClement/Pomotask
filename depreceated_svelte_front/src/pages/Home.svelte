<script>
		import { authClient } from "../lib/auth-client";
		import { api } from "../lib/axios";
    import TaskList from "./task/TaskList.svelte";

		const session = authClient.useSession();

		let tasks = $state([]);
		let status = $state([]);

		const fetchData = async () => {
				try{
						const res = await api.get("/tasks");
						tasks = res.data.tasks;
				}catch(err){
						console.error(err);
				}
		}

		const fetchStatus = async () => {
			try {
				const res = await api.get("/status-task");
				status = res.data.status;
			}catch(err){
				console.error(err);
			}
		}

		// Cette rune s'exécute au montage du composant
		$effect(() => {
				// On vérifie si l'utilisateur est connecté avant de fetch
				// Note: l'accès à $session.data ici rend l'effet réactif à la session
				if ($session.data) {
						fetchData();
						fetchStatus();
				}
		});

		const updateStatusTask = async (task) => {
			const payload = {
				statusId: task.statusId
			}

			try {
				await api.patch(`/tasks/status/${task.id}`, payload);
				await fetchData();
			}catch(err){
				console.error(err);
			}
		}

		const deleteTask = async (task) => {
			try{
				await api.delete(`/tasks/${task.id}`)
				await fetchData();
			}catch(err){
				console.error(err);
			}
		}

</script>

<div class="">
	{#if $session.data}
		<TaskList />
	{:else}
		<h1>Bienvenue sur TodoBangBang!</h1>
		<p>Veuillez vous connecter ou vous inscrire pour gérer vos tâches.</p>
	{/if}
</div>

<style>
		
</style>


