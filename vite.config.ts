import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  build: { sourcemap: true },
  css: { devSourcemap: true },
  optimizeDeps: {
    exclude: [/* '@iconify-icons/ph' */] // exclude iconify libraries to preserve HMR
  }
});
