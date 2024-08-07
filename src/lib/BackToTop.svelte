<script lang="ts">
  import { ChevronUpOutline } from 'carbon-icons-svelte'
  import { fade } from 'svelte/transition'

  export let sensitivity = 500

  let scrollHeight = 0

  $: showGotoTop = scrollHeight > sensitivity
</script>

<svelte:window bind:scrollY={scrollHeight} />

{#if showGotoTop}
  <a href="#main-content" in:fade out:fade class="[ fixed right-6 bottom-4 inline-flex items-center gap-2 bg-tagyellow-200 py-2 px-4 ]">
    <span>Back to top</span>
    <ChevronUpOutline />
  </a>
{/if}

<style>

:global(html) {
  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}
</style>
