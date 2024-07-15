<script lang="ts">
  import { getContext } from 'svelte'

  export let value: string

  const { updateValue } = getContext<any>('DatePicker')
  $: updateValue({ type: 'input', value })
</script>
