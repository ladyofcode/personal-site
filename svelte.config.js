// import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-node allows prerendering most pages while server-rendering dynamic ones
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			out: 'build',
			precompress: false
		}),
		prerender: {
			handleMissingId: 'ignore'
		}
	}
};

export default config;
