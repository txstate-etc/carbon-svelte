<script lang="ts">
  export let href: string | undefined
</script>
{#if href}
  <a {href} {...$$restProps} on:click><slot/></a>
{:else}
  <slot/>
{/if}
