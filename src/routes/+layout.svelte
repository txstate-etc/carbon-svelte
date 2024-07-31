<script lang="ts">
  import { UIShell } from '$lib/index.js'
  import '../app.css'
</script>

<UIShell appName="Component Library" navRoot={{
  title: 'Carbon Components',
  routeId: '/',
  children: [
    {
      group: 'Demos',
      title: 'Forms',
      routeId: '/demo/form'
    },
    {
      group: 'Demos',
      title: 'Panel',
      routeId: '/demo/panel'
    },
    {
      group: 'Components',
      title: 'ActionSet',
      routeId: '/component/ActionSet'
    }
  ]
}} profilelinks={[{ label: 'Logout', href: '#' }]}>
  <slot/>
</UIShell>
