<script lang="ts">
  import { goto } from "@mateothegreat/svelte5-router";
  import { authClient } from "../../lib/auth-client";

  const session = authClient.useSession();

  const handleLogout = async () => {
    try{
      await authClient.signOut();
    }catch(error){
      console.error("Erreur lors de la déconnexion:", error);
    }
    goto('/');
  }

</script>

<header>
  <a class="" href="/">
    TodoBangBang
  </a>

  {#if $session.data}
    <nav>
      <ul class="nav-link">
        <li>
          <a href="/tasks">Tâches</a>
        </li>
        <li>
          <a href="/projects">Projets</a>
        </li>
      </ul>
    </nav>
  {/if}

  <nav>
    <ul class="nav-action">
      {#if $session.data}
        <li>
          <p>{$session.data.user.name}</p>
        </li>
        <li>
          <button onclick={handleLogout} class="btn" type="button">Déconnexion</button>
        </li>
      {:else}
        <li>
            <a href="/login" class="btn btn-sm">Connexion</a>
          </li>
        <li>
          <a href="/register" class="btn">Inscription</a>
        </li>
      {/if}
    </ul>
  </nav>

</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    padding: 1rem 2.5rem;
    box-shadow: var(--shadow);
    align-items: center;
  }

  .nav-action, .nav-link {
    display: flex;
    gap: 1rem;
    list-style: none;
    align-items: center;
  }
</style>