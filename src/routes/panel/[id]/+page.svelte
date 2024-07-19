<script lang="ts">
  import { Panel } from '$lib/index.js'
</script>

<Panel title="h2" expandable>
  This is some content below an h2.
</Panel>

<Panel title="h3" headerLevel={3} expandable actions={[{ label: 'Edit' }]}>
  This is some content below an h3.
</Panel>

<Panel title="h4" headerLevel={4} expandable>
  This is some content below an h4.
</Panel>
