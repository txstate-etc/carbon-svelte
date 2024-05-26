<script lang="ts">
  import { LayoutBase } from '$lib/index.js'
  import '../app.css'
</script>

<svelte:head>
  <title>Component Library</title>
</svelte:head>

<LayoutBase>
  <slot/>
</LayoutBase>
