<script lang="ts">
  import { Button } from 'carbon-components-svelte'
  import { FieldTextArea, PanelFormDialog } from '$lib/index.js'
  let shown = false
</script>
<Button type="button" on:click={() => { shown = true }}>Show Modal</Button>
<PanelFormDialog bind:open={shown} centered unsavedWarning disableSaveUntilChanged title="Reject Submission" on:cancel={() => { shown = false }} on:saved={() => { shown = false }}>
  <FieldTextArea path="reason" labelText="Test" />
</PanelFormDialog>
