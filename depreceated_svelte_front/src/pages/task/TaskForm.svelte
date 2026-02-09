<script lang="ts">
    
    import type { Project } from "../../types/project";
    import Loader from "../../components/Loader.svelte";
    import { api } from "../../lib/axios";
    import { string, z } from 'zod';
    import zodUtils from "../../lib/zod";
    import { apiHook } from "../../hooks/apiHook";

    let projects: Project[] = $state([]);
    let error = $state<string | null>(null);
    let isLoading = $state(true);

    const loadProject = async () => {
      isLoading = true;
      error = null;

      try {
			  const res = await apiHook.getAll<{ projects: Project[]}>('/projects');

			if(!res){
				throw new Error("Echec de récupération des projets");
			}
			projects = res.projects;
      }catch(err){
        console.error(err);
        error = "Echec de récupération des projets"
      }finally {
        isLoading = false;
      }
    }

    const schema = z.object({
      title: z.string().min(1, "Un titre valide est attendu"),
      description: z.string().optional(),
      projectId: z.int().optional(),
      branche: z.string().optional(),
    })


    let errorsSubmit = $state<Record<string, string[]>>({});
    let loadingSubmit = $state(false);
    let serverError = $state("");

    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      
      loadingSubmit = true;
      errorsSubmit = {};
      serverError = "";

      const formData = new FormData(event.target as HTMLFormElement);
      const data = Object.fromEntries(formData);

      const result = schema.safeParse(data);

      if(!result.success){
        errorsSubmit = zodUtils.extractErrors(result);
        loadingSubmit = false;
        return;
      }

      const payload = {
        title: result.data.title,
        description: result.data.description ?? null,
        projectId: result.data.projectId ?? null,
        branche: result.data.branche ?? null
      }

      try {
        const res = await api.post('/tasks', payload)
        console.log(res);  
      }catch(err){
        console.error(err);
      }
    }

    loadProject();
</script>

<form class="form" onsubmit={handleSubmit}>
  
  <div class="field">
    <label for="title" class="field-label">Nom :</label>
    <input type="text" id="title" name="title" class="input"/>
  </div>

  {#if isLoading}
    <Loader />
  {:else if projects.length === 0}
    <p>Aucun projet disponible</p>
  {:else}
    <div class="field">
      <label for="project">Projets :</label>
      <select name="" id="" class="input">
        <option value="">Autre</option>
        {#each projects as project}
          <option value={project.id}>{project.title}</option>
        {/each}
      </select>
    </div>  
  {/if}
  
  <div class="field">
    <label for="branche">Branche :</label>
    <input type="text" name="branche" id="branche" class="input">
  </div>

  <div class="field">
    <label for="description">Description :</label>
    <textarea name="description" id="description" rows="10" class="input"></textarea>
  </div>

  <div class="form-action">
    <button type="reset" class="btn">Reset</button>
    <button type="submit" class="btn">Création</button>
  </div>

</form>