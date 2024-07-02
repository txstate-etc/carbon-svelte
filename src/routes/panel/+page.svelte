<script lang="ts">
  import { Add, Edit, TrashCan, User, View } from 'carbon-icons-svelte'
  import { base } from '$app/paths'
  import { Card, CardGrid, Pagination, Panel, TabLinks } from '$lib/index.js'
</script>
<TabLinks tabs={[{ label: 'Panel 30', href: base + '/panel/30' }, { label: 'Panel 40', href: base + '/panel/40' }, { label: 'Panel 50', href: base + '/panel/50' }]} />
<Panel title="Test Panel" tabs={[{ value: 'Enabled' }, { value: 'Disabled', badge: 400 }]} actions={[{ label: 'Add Item', icon: Add }, { label: 'Other Action' }]} let:tab>
  {#if tab === 0}
    <Pagination totalItems={134} chooseSize />
    <CardGrid>
      <Card
        title="Test Card 1"
        subhead="Subhead"
        actions={[{ label: 'Edit' }]}
        navigations={[{ label: 'See More', href: '#' }]}
        tags={[
          { label: 'First', onClick: () => { alert('hi!') }, type: 'green' },
          { label: 'Second', onClick: () => { alert('hi!') }, type: 'cyan' },
          { label: 'Third', onClick: () => { alert('hi!') }, type: 'blue' },
          { label: 'Fourth', onClick: () => { alert('hi!') }, type: 'magenta' },
          { label: 'Fifth', onClick: () => { alert('hi!') }, type: 'purple' },
          { label: 'Sixth', onClick: () => { alert('hi!') }, type: 'teal' },
          { label: 'Seventh', onClick: () => { alert('another') }, type: 'cool-gray' },
          { label: 'Eighth', onClick: () => { alert('another') }, type: 'warm-gray' },
          { label: 'Ninth', onClick: () => { alert('another') }, type: 'gray' },
          { label: 'Tenth', onClick: () => { alert('another') }, type: 'red' }
        ]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
      <Card
        title="Test Card 2"
        emphasizeTitle
        subhead="Subhead"
        actions={[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan, onClick: () => { alert('delete!') } }]}
        navigations={[{ label: 'See More', href: '#' }]}
        tags={[{ label: 'Very Extremely Unnecessarily Long Tag Label' }, { label: 'VeryExtremelyUnnecessarilyLongTagLabel' }]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
      <Card
        title="Test Card With a Very Very Long Title"
        subhead="Subhead"
        actions={[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan, disabled: true, onClick: () => { alert('oops!') } }, { label: 'Manage Users', icon: User }]}
        navigations={[{ label: 'See More', href: '#', icon: View }]}
        tags={[{ label: 'Important' }]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
      <Card
        title="Test Card 4"
        actions={[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan, disabled: true }, { label: 'Manage Users', icon: User }]}
        navigations={[{ label: 'See More', href: '#' }, { label: 'See Even More', href: '#' }]}
        noPrimaryNavigation
        tags={[{ label: 'Important' }]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
      <Card
        title="Test Card 5"
        subhead="Subhead"
        actions={[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan }, { label: 'Manage Users', icon: User }]}
        noPrimaryAction
        navigations={[{ label: 'See More', href: '#' }, { label: 'See Even More', href: '#' }]}
        tags={[{ label: 'Important' }]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
      <Card
        title="Force Overflow"
        subhead="Subhead"
        actions={[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: TrashCan }, { label: 'Manage Users', icon: User }]}
        forceOverflow
        navigations={[{ label: 'See More', href: '#' }]}
        tags={[{ label: 'Important' }]}
      >
        <ul>
          <li>Some</li>
          <li>Content</li>
          <li>Here</li>
        </ul>
      </Card>
    </CardGrid>
  {:else}
    <div>Disabled</div>
  {/if}
</Panel>
