<script lang="ts">
  import { ScreenReaderOnly } from '@txstate-mws/svelte-components'
  import type { HTMLBaseAttributes } from 'svelte/elements'

  interface $$Props extends HTMLBaseAttributes {
    value?: number
  }

  export let value: number | undefined = undefined
</script>

{#if value != null}
  <span {...$$restProps} class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold rounded-full align-text-bottom {$$restProps.class}"><ScreenReaderOnly>count </ScreenReaderOnly>{value}</span>
{/if}

<style>
  span {
    background-color: var(--badge-bg, var(--cds-support-01, #ff0000));
    color: var(--badge-text, white);
  }
</style>
