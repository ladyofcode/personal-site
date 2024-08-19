import yaml from '@rollup/plugin-yaml';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), yaml()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
