<script lang="ts">
  import { Edit, TrashCan, View } from 'carbon-icons-svelte'
  import { ColumnList, FieldMultiselect, FieldSelect, FilterUI, PageActions } from '$lib/index.js'
  function onFilter (e: CustomEvent<any>) {
    // change what you send as the `rows` prop to the ColumnList
  }
</script>

<FilterUI on:apply={onFilter} search tabs={[{ label: 'Open', value: { open: true } }, { label: 'Approved', value: { approved: true } }, { label: 'Closed', value: { closed: true } }]}>
  <FieldMultiselect path="color" label="Filter By Color" items={[
    { value: 'Blue' }, { value: 'Green' }, { value: 'Red' }, { value: 'Yellow' }, { value: 'Purple' }, { value: 'Orange' }
  ]} />
  <svelte:fragment slot="quickfilters">
    <FieldSelect path="quick" labelText="Fruit" items={[{ value: 'Apple' }, { value: 'Banana' }, { value: 'Plum' }]} />
  </svelte:fragment>
</FilterUI>
<PageActions actions={[{ label: 'Create' }]}/>
<ColumnList
  title="Tests"
  columns={[
    { id: 'id', label: 'ID', get: 'id', fixed: '5em' },
    { id: 'name', label: 'Name', grow: 5, get: 'name', href: (row) => 'https://google.com', icon: { icon: View } },
    { id: 'tags', label: 'Tags', grow: 4, tags: row => [{ label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Important', type: 'cyan' }, { label: 'Importantttt', type: 'cyan' }, { label: 'Important', type: 'cyan' }] }
  ]}
  rows={[
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
