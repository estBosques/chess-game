/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: 'src/lib',
			$styles: 'src/styles',
			$interfaces: 'src/interfaces',
			$utils: 'src/utils',
			'~bootstrap': 'node_modules/bootstrap'
		}
	},
	test: {
		coverage: {
			provider: 'v8' // 'instanbul' or 'v8'
		}
	},
	server: {
		port: 5174,
		host: '0.0.0.0',
		strictPort: true,
		watch: {
			usePolling: true
		}
	}
});
