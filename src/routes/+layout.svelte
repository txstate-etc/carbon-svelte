<script lang="ts">
  import { UIShell } from '$lib/index.js'
  import '../app.css'
  import { Report, Settings, ViewFilled } from 'carbon-icons-svelte'
</script>

<UIShell appName="Component Library" navRoot={{
  title: 'Component Library',
  routeId: '/',
  icon: ViewFilled,
  children: [
    {
      group: 'Demos',
      title: 'Forms',
      routeId: '/demo/form'
    },
    {
      group: 'Demos',
      title: 'Panel',
      routeId: '/demo/panel',
      icon: Report
    },
    {
      group: 'Demos',
      title: 'ColumnList',
      routeId: '/demo/columnlist',
      icon: Report
    },
    {
      group: 'Components',
      icon: Settings,
      title: 'ActionSet',
      routeId: '/component/ActionSet'
    },
    {
      group: 'Components',
      title: 'Card',
      routeId: '/component/Card'
    },
    {
      group: 'Components',
      title: 'CardGrid',
      routeId: '/component/CardGrid'
    },
    {
      group: 'Components',
      title: 'Pagination',
      routeId: '/component/Pagination'
    },
    {
      group: 'Components',
      title: 'PanelFormDialog',
      routeId: '/component/PanelFormDialog'
    },
    {
      group: 'Components',
      title: 'FilterUI',
      routeId: '/component/FilterUI'
    }
  ]
}} profilelinks={[{ label: 'Logout', href: '#' }]}>
  <slot/>
</UIShell>
