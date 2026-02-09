<script lang="ts">
  import { api } from "../../lib/axios";
  import { authClient } from "../../lib/auth-client";
  import { dateUtils } from "../../utils/dateUtils"
    import type { Project } from "../../types/project";

  const session = authClient.useSession();

  let projects: Project[] = $state([]);

  $effect(() => {
    if($session.data){
      fetchProjects();
    }
  })

  const fetchProjects = async () => {
    try{
      const res = await api.get('/projects');
      projects = res.data.projects;
    }catch(err){
      console.error("Echec de creation d'un nouveau projet:", err);
    }
  }

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const payload = {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
    }
    console.log(payload);
    try{
      const res = await api.post('/projects', payload);
      fetchProjects();
    }catch(err){
      console.error("Echec de recuperqtion des project", err);
    }
  }

  $inspect(projects);


</script>

<div class="">
  <form action="" onsubmit={handleSubmit}>
    <div class="">
      <label for="">Nom</label>
      <input type="text" name="title">
    </div>
  
    <div class="">
      <label for="description">Description</label>
      <textarea name="description" id="description"></textarea>
    </div>
  
    <div class="">
      <button type="submit">Créer</button>
    </div>
  </form>
  
  <div class="">
    <h2>Liste des projets en cours</h2>
  
    <ul>
      {#each projects as project}
        <li>{project.title}</li>
        <li>{dateUtils.formatDateFr(project.createdAt)}</li>
      {/each}
    </ul>
  </div>
</div>