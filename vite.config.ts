import { sveltekit } from '@sveltejs/kit/vite'
import { optimizeCss } from 'carbon-preprocess-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit(), optimizeCss()],
  build: { sourcemap: true },
  css: { devSourcemap: true },
  optimizeDeps: {
    noDiscovery: true
  }
});
