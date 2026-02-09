<script lang="ts">
    import { goto } from "@mateothegreat/svelte5-router";
    import { api } from "../../lib/axios";

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        const payload = {
            title: data.title,
            description: data.description
        }

        try{
            const res = await api.post("/tasks", payload);
            goto('/')
        }catch(err){
            console.error(err);
        }
    }
</script>



<form action="" onsubmit={handleSubmit}>
    <label for="title">Titre de la tâche:</label>
    <input type="text" id="title" name="title" required>

    <label for="description">Description:</label>
    <textarea id="description" name="description"></textarea>

    <button type="submit" class="btn">Créer la tâche</button>
</form>