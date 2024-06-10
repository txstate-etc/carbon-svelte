<script lang="ts">
  export let cardSize: string | undefined = undefined
  export let gap: string | undefined = undefined
</script>

<div role="list" aria-label="cards" class="card-list" style:--grid-min-item-size={cardSize} style:--grid-gap={gap}>
  <slot />
</div>

<style>
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min-item-size, 20rem)), 1fr));
  gap: var(--grid-gap, 16px);
}
</style>
