<script lang="ts">
    import { Router } from "@mateothegreat/svelte5-router";
    import { routes } from "./router/router";
    import Header from "./components/partials/Header.svelte";
    import Footer from "./components/partials/Footer.svelte";

</script>

<Header />

<main class="main-container">
  <Router {routes} />
</main>

<Footer />




