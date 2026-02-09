<script lang="ts">
    import { z } from 'zod';
    import { authClient } from '../lib/auth-client';
    import zodUtils from '../lib/zod';

    let errors = $state<Record<string, string[]>>({});
    let loading = $state(false);
    let serverError = $state("");

    const schema = z.object({
        email: z.email().min(1, "Une adresse email valide est attendu"),
        password: z.string().min(8, "Un mot de passe de 8 caractères est attendu"),
        name: z.string().min(1, "Un nom est requis"),
        confirmPassword: z.string().min(8, "Le mot de passe n'est pas confimé")
    }).refine((val) => val.password === val.confirmPassword, {
        error: "Le mot de passe n'est pas confirmé",
        path: ['confirmPassword']
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

        const { email, name, password } = result.data;

        const { data: session, error } = await authClient.signUp.email({
            email,
            name,
            password
        });

        if(error){
            serverError = error.message || "Une erreur est survenue";
            loading = false;
        }else{
            console.log("Inscription réussie, session:", session);
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
    <label for="">Nom:</label>
    <input 
      type="text" 
      name="name" 
      >
  </div>

  <div class="">
    <label for="">Mot de passe</label>
    <input type="password" name="password" autocomplete="off">
  </div>

  <div class="">
    <label for="">confirmation du mot de passe</label>
    <input type="password" name="confirmPassword" autocomplete="off">
  </div>

  {#if serverError}<p class="server-error">{serverError}</p>{/if}

  <div class="">
    <a href="/login">J'ai déjà un compte</a>
  </div>

  <div class="">
    <button type="reset" class="btn">Reset</button>
    <button type="submit" disabled={loading}>Inscription</button>
  </div>
</form>

<style>
  .server-error{
    color: red;
    font-weight: bold;
    font-style: italic;
  }
</style>