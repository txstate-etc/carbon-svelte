<script>
  import { Edit, TrashCan } from 'carbon-icons-svelte'
  import ColumnList from '$lib/ColumnList.svelte'
</script>

<ColumnList
  columns={[
    { id: 'id', label: 'ID', get: 'id', fixed: '5em' },
    { id: 'name', label: 'Name', get: 'name' }
  ]} rows={[
    { id: '5', name: 'Blue' },
    { id: '6', name: 'Green' },
    { id: '7', name: 'Red' }
  ]}
  actions={row => [{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan }]}
  selectedActions={rows => [{ label: 'Edit' }]}
>
This is some content.
</ColumnList>
