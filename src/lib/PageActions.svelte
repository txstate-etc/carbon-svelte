<script lang="ts">
  import { type ActionItem } from './util.js'
  import ActionSet from './ActionSet.svelte'

  export let actions: ActionItem[] = []
  export let noPrimaryAction = false
  export let maxButtons = 3
</script>

<div class="[ flex justify-end mb-[8px] ]">
  <ActionSet includeLabels {actions} {noPrimaryAction} {maxButtons} />
</div>
