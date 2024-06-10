<script lang="ts">
  import { UIShell } from '$lib/index.js'
  import '../app.css'
</script>

<UIShell appName="Component Library" navRoot={{
  title: 'Carbon Components',
  routeId: '/',
  children: [
    {
      title: 'Panel Demo',
      routeId: '/panel',
      // preloadParams: async () => api.getStuff() [{ id: 'blah', catId: 'blah' }],
      children: [
        { routeId: '/panel/[id]', title: $page => $page.params.id, children: [] }
      ]
    },
    { title: 'Another', routeId: '/another', children: [], group: 'Group' }
  ]
}} profilelinks={[{ label: 'Logout', href: '#' }]}>
  <slot/>
</UIShell>
