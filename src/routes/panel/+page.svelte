<script lang="ts">
  import { Pagination, Panel } from '$lib/index.js'
  import { Add } from 'carbon-icons-svelte'
</script>

<Panel title="Test Panel" tabs={[{ value: 'Enabled' }, { value: 'Disabled', badge: 4 }]} actions={[{ label: 'Add Item', icon: Add }, { label: 'Other Action' }]} let:tab>
  {#if tab === 0}
    <Pagination totalItems={134} chooseSize />
    <div>Enabled</div>
  {:else}
    <div>Disabled</div>
  {/if}
</Panel>
