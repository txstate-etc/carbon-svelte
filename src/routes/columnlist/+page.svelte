<script>
  import { Edit, TrashCan, View } from 'carbon-icons-svelte'
  import ColumnList from '$lib/ColumnList.svelte'
</script>

<ColumnList
  title="Tests"
  columns={[
    { id: 'id', label: 'ID', get: 'id', fixed: '5em' },
    { id: 'name', label: 'Name', grow: 5, get: 'name', href: (row) => 'https://google.com', icon: { icon: View } },
    { id: 'tags', label: 'Tags', grow: 4, tags: row => [{ label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Importantttt', type: 'cyan' }, { label: 'Important', type: 'cyan' }] }
  ]} rows={[
    { id: '5', name: 'Blue' },
    { id: '6', name: 'Green' },
    { id: '7', name: 'Red' }
  ]}
  actions={row => [{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan }]}
  selectedActions={rows => [{ label: 'Edit' }]}
  responsiveColumns={() => ['id', 'name']}
>
  This is some content.
  <svelte:fragment slot="smallFilters">
    My filters
  </svelte:fragment>
</ColumnList>
