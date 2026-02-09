<script lang="ts">
  import { LoaderCircle } from "@lucide/svelte";
</script>

<div class="loader-container">
  <LoaderCircle class="load-animation" size={24}/>
</div>  

<style>
  .loader-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  :global(.load-animation) {
    animation: rotate 1s linear infinite;
    display: block;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>

