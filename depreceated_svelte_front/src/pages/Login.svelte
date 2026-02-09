<script lang="ts">
    import { z } from 'zod';
    import { authClient } from '../lib/auth-client';
    import zodUtils from '../lib/zod';
    import { goto } from '@mateothegreat/svelte5-router';

    let errors = $state<Record<string, string[]>>({});
    let loading = $state(false);
    let serverError = $state("");

    const schema = z.object({
        email: z.email().min(1, "Une adresse email valide est attendu"),
        password: z.string().min(8, "Un mot de passe de 8 caractères est attendu"),
    })


    async function handleSubmit(event: Event){
        event.preventDefault();
        
        loading = true;
        errors = {};
        serverError = "";

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        const result = schema.safeParse(data);

        if(!result.success){
            errors = zodUtils.extractErrors(result);
            loading = false;
            return;
        }

        const { email, password } = result.data;

        const { data: session, error } = await authClient.signIn.email({
            email,
            password
        });

        if(error){
            serverError = error.message || "Une erreur est survenue";
            loading = false;
        }else{
            console.log("Connexion réussie, session:", session);
            goto('/');
        }

    }
</script>

<form action="" method="POST" onsubmit={handleSubmit}>
  <div class="">
    <label for="">Email:</label>
    <input 
      type="email" 
      name="email" 
      >
  </div>

  <div class="">
    <label for="">Mot de passe</label>
    <input type="password" name="password" autocomplete="off">
  </div>

  {#if serverError}<p>{serverError}</p>{/if}

  <div class="">
    <a href="/register">Je n'ai pas de compte</a>
  </div>

  <div class="">
    <button type="reset" class="btn">Reset</button>
    <button type="submit" disabled={loading}>Connexion</button>
  </div>
</form>