<script lang="ts">
  import { resize, ResizeStore } from '@txstate-mws/svelte-components'

  export let cardSize = 350

  const store = new ResizeStore()

  $: columns = Math.round($store.clientWidth! / cardSize)
</script>

<div use:resize={{ store }} role="list" aria-label="cards" class="[ flex flex-wrap gap-1 ]"
  class:col-2={columns === 2} class:col-3={columns === 3}
  class:col-4={columns === 4} class:col-5={columns === 5}
  class:col-6={columns === 6}
>
  <slot />
</div>

<style>
  div > :global(*) {
    width: 100%;
  }
  div.col-2 > :global(*) {
    width: calc(50% - 0.25rem / 2);
  }
  div.col-3 > :global(*) {
    width: calc(33.33% - 0.5rem / 3);
  }
  div.col-4 > :global(*) {
    width: calc(25% - 0.75rem / 4);
  }
  div.col-5 > :global(*) {
    width: calc(20% - 1rem / 5);
  }
  div.col-6 > :global(*) {
    width: calc(16.67% - 1.25rem / 6);
  }
</style>
