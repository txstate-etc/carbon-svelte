<script lang="ts">
  import { FilterUI, Panel, Pagination, ColumnList } from '$lib/index.js'
  import { Download, Rocket, Add, TrashCan, MagicWand } from 'carbon-icons-svelte'
</script>

<span class="svelte-page">
<FilterUI
  search
  tabs={[
    {
      label: 'Exports pending',
      value: 'pending'
    },
    {
      label: 'Exports completed',
      value: 'completed'
    }
  ]} />
<Panel title="Ready for export" actions={[{ label: 'Launch', icon: Rocket }]}>
  <Pagination
    totalItems={1}
    pageSize={25}
    chooseSize
    noun="item"
    nounPlural="items" />
  <ColumnList listActions={[{ label: 'Add Item', icon: Add, onClick: () => alert('Add Item') }, { label: 'Clear List', icon: TrashCan, onClick: () => alert('Clear List') }]} selectedActions={(selectedRows) => {return [{ label: 'Download', icon: Download, onClick: () => alert('Download') }, { label: 'Convert', icon: MagicWand, onClick: () => alert('Convert') }]}} expanded columns={[
      {
        id: 'dateauthor',
        label: 'Date and Author',
        render: (row) => `${row.lastModifiedDateTime}<br>${row.lastModifiedBy}`
      },
      {
        id: 'comment',
        label: 'Comment',
        get: 'comment'
      },
      {
        id: 'identifer',
        label: 'Donation Identifier',
        tags: (row) => { return [{ value: 'foo', label: 'Check 12345' }] }
      },
      {
        id: 'studentname',
        label: 'Student name',
        render: (row) => 'Firstname, Lastname'
      },
      {
        id: 'studentanumber',
        label: 'A number',
        tags: (row) => { return [{ value: 'foo', label: 'A12345678', type: 'green' }] }
      }
    ]}
    rows={[
      {
        id: 12,
        lastModifiedDateTime: "9/9/2024 3:38:52 pm",
        lastModifiedBy: "abc123",
        comment: null
      }
    ]}
    title="Test">
    Test Content
  </ColumnList>
</Panel>
</span>
