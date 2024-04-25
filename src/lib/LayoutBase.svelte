<script lang="ts">
  import { Theme } from 'carbon-components-svelte'
  import { Toasts } from '$lib/index.js'
  import 'carbon-components-svelte/css/all.css'
  import '@fontsource/roboto/300.css'
  import '@fontsource/roboto/400.css'
  import '@fontsource/roboto/500.css'
  import '@fontsource/roboto/700.css'
  import '@fontsource/roboto/300-italic.css'
  import '@fontsource/roboto/400-italic.css'
  import '@fontsource/roboto/500-italic.css'
  import '@fontsource/roboto/700-italic.css'
  import '@fontsource/roboto-mono/400.css'
  import '@fontsource/roboto-mono/600.css'
  import '@fontsource/roboto-mono/400-italic.css'
  import '@fontsource/roboto-mono/600-italic.css'
  import '@fontsource/roboto-serif/400.css'
  import '@fontsource/roboto-serif/500.css'
  import '@fontsource/roboto-serif/600.css'
  import '@fontsource/roboto-serif/400-italic.css'
  import '@fontsource/roboto-serif/500-italic.css'
  import '@fontsource/roboto-serif/600-italic.css'
  import './layoutbase.css'
</script>

<Theme tokens={{
  'code-01-font-family': '"Roboto Mono", sans-serif',
  'code-02-font-family': '"Roboto Mono", sans-serif',
  'quotation-01-font-family': '"Roboto Serif", serif',
  'quotation-02-font-family': '"Roboto Serif", serif',
  'fluid-quotation-01-font-family': '"Roboto Serif", serif',
  'fluid-quotation-02-font-family': '"Roboto Serif", serif'
}}/>
<Toasts />
<slot/>
