<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{ label: 'Log', path: '/' },
		{ label: '100 Days', path: '/100-days' },
		{ label: 'Atlantis', path: 'https://inatlantis.io/' },
		{ label: 'Stream', path: 'https://twitch.tv/ladyofcode' },
		{ label: 'Work', path: 'https://ladyofcode.com' },
		{ label: 'About', path: '/about' }
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li class:active={page.url.pathname === `${item.path}`}>
				<a data-sveltekit-preload-data="hover" href={item.path}>{item.label}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		z-index: 999;
		width: 100%;
		height: var(--height-main-menu);
		background-color: var(--clr-leather-dark);
		background: radial-gradient(circle, rgb(76, 39, 5) 0%, rgb(45, 22, 1) 93%);
	}

	ul {
		height: 100%;
		width: 100%;
		max-width: var(--width-content);
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		list-style: none;
	}

	li {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	li {
		font-family: 'Domine', serif;
		text-transform: uppercase;
		color: #fff;
		position: relative;
        background: linear-gradient(to bottom, #cfc09f 27%, #ffecb3 40%, #3a2c0f 78%); 
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

	li::after {
		background: none;
		content: '';
		left: 0;
		top: 0;
		position: absolute;
		text-shadow: -1px 0 1px #c6bb9f, 0 1px 1px #c6bb9f, 5px 5px 10px rgba(0, 0, 0, 0.4),
			-5px -5px 10px rgba(0, 0, 0, 0.4);
	}

	
	a {
		padding: var(--space-md);
		text-decoration: none;
		color: #fff;
		font-family: "Domine", serif;
		text-transform: uppercase;
	}
</style>