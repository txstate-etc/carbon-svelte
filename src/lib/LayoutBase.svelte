<script lang="ts">
  import { Theme } from 'carbon-components-svelte'
  import Toasts from './Toasts.svelte'
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
  'code-01-font-family': '"Roboto Mono", monospace',
  'code-02-font-family': '"Roboto Mono", monospace',
  'quotation-01-font-family': '"Roboto Serif", serif',
  'quotation-02-font-family': '"Roboto Serif", serif',
  'fluid-quotation-01-font-family': '"Roboto Serif", serif',
  'fluid-quotation-02-font-family': '"Roboto Serif", serif',
  'interactive-01': '#501214',
  'hover-primary': '#622a2c',
  'interactive-03': '#501214',
  'hover-tertiary': '#501214',
  'interactive-02': '#ffffff',
  'hover-secondary': '#501214',
  'interactive-04': '#501214'
}}/>
<Toasts />
<slot/>
