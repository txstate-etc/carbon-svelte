<script lang="ts">
  import { Theme } from 'carbon-components-svelte'
  import { Toasts } from '$lib/index.js'
  import 'carbon-components-svelte/css/all.css'
  import './layoutbase.css'
</script>

<Theme tokens={{

}}/>
<Toasts />
<slot/>
