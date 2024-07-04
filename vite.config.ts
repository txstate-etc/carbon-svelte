import { sveltekit } from '@sveltejs/kit/vite'
import { optimizeCss } from 'carbon-preprocess-svelte'
import { defineConfig } from 'vite'
import circleDependency from 'vite-plugin-circular-dependency'

export default defineConfig({
	plugins: [sveltekit(), optimizeCss(), circleDependency()],
  build: { sourcemap: true },
  css: { devSourcemap: true },
  optimizeDeps: {
    noDiscovery: true
  }
});
