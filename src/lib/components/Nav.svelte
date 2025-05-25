<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let isMobileMenuOpen = false;
	let isDropdownOpen = false;
	let isMobile = false;

	const navItems = [
		{ label: 'Log', path: '/' },
		{ label: '100 Days', path: '/100-days' },
		{ label: 'Escape rooms', path: '/escape-rooms' },
		{ label: 'Stream', path: 'https://twitch.tv/ladyofcode' },
		{ label: 'About', path: '/about' }
	];

	const dropdownItems = [
		{ label: 'Work', path: 'https://ladyofcode.com' },
		{ label: 'Atlantis', path: 'https://inatlantis.io/' }
	];

	function handleResize() {
		isMobile = window.innerWidth < 995;
		if (!isMobile) {
			isMobileMenuOpen = false;
		}
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function handleNavigation() {
		if (isMobile && isMobileMenuOpen) {
			toggleMobileMenu();
		}
		if (isDropdownOpen) {
			isDropdownOpen = false;
		}
	}

	onMount(() => {
		document.body.style.overflow = '';
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			document.body.style.overflow = '';
		};
	});
</script>

<nav class:mobile-menu-open={isMobileMenuOpen}>
	<button class="mobile-menu-button" onclick={toggleMobileMenu} aria-label="Toggle menu">
		<svg class="menu-icon" viewBox="0 0 122.88 95.95">
			<path d="M8.94,0h105c4.92,0,8.94,4.02,8.94,8.94l0,0c0,4.92-4.02,8.94-8.94,8.94h-105C4.02,17.88,0,13.86,0,8.94l0,0 C0,4.02,4.02,0,8.94,0L8.94,0z M8.94,78.07h105c4.92,0,8.94,4.02,8.94,8.94l0,0c0,4.92-4.02,8.94-8.94,8.94h-105 C4.02,95.95,0,91.93,0,87.01l0,0C0,82.09,4.02,78.07,8.94,78.07L8.94,78.07z M8.94,39.03h105c4.92,0,8.94,4.02,8.94,8.94l0,0 c0,4.92-4.02,8.94-8.94,8.94h-105C4.02,56.91,0,52.89,0,47.97l0,0C0,43.06,4.02,39.03,8.94,39.03L8.94,39.03z" fill="currentColor"/>
		</svg>
	</button>

	<ul class:mobile-menu={isMobile}>
		{#each navItems as item}
			<li class:active={page.url.pathname === item.path}>
				<a href={item.path} onclick={handleNavigation}>{item.label}</a>
			</li>
		{/each}
		
		<li class="dropdown" class:active={isDropdownOpen}>
			<button onclick={toggleDropdown} class="dropdown-button">
				More
				<svg class="dropdown-arrow" viewBox="0 0 24 24" class:open={isDropdownOpen}>
					<path d="M7 10l5 5 5-5" fill="none" stroke="#cfc09f " stroke-width="2"/>
				</svg>
			</button>
			{#if isDropdownOpen || !isMobile}
				<ul class="dropdown-menu">
					{#each dropdownItems as item}
						<li>
							<a href={item.path} onclick={handleNavigation}>{item.label}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	</ul>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		z-index: 600;
		width: 100%;
		height: var(--height-main-menu);
		background-color: var(--clr-leather-dark);
		background: radial-gradient(circle, rgb(76, 39, 5) 0%, rgb(45, 22, 1) 93%);
	}

	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		padding: var(--space-md);
		cursor: pointer;
		color: #fff;
	}

	.menu-icon {
		width: 24px;
		height: 24px;
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
		padding: 0 var(--space-md);
	}

	li {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	li {
		font-family: 'Domine', serif;
		text-transform: uppercase;
		color: #fff;
		background: linear-gradient(to bottom, #cfc09f 27%, #ffecb3 40%, #3a2c0f 78%); 
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.dropdown {
		position: relative;
	}

	.dropdown-button {
		background: none;
		border: none;
		padding: var(--space-md);
		cursor: pointer;
		font-family: inherit;
		font-size: inherit;
		text-transform: inherit;
		color: inherit;
		display: flex;
		align-items: center;
		gap: 4px;
		width: 100%;
		justify-content: flex-start;
	}

	.dropdown-arrow {
		width: 16px;
		height: 16px;
		transition: transform 0.2s;
	}

	.dropdown-arrow.open {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		background: var(--clr-leather-dark);
		min-width: 200px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		display: none;
		flex-direction: column;
		padding: var(--space-sm) 0;
		height: fit-content;
		left: 18px;
		/* margin-top: var(--height-main-menu); */
	}

	.dropdown:hover .dropdown-menu {
		display: flex;
	}

	a {
		padding: var(--space-md);
		text-decoration: none;
		color: inherit;
		font-family: inherit;
		text-transform: inherit;
		display: block;
		width: 100%;
		text-align: left;
	}

	@media (max-width: 768px) {
		.mobile-menu-button {
			display: block;
			position: absolute;
			right: var(--space-md);
			top: 50%;
			transform: translateY(-50%);
			z-index: 1000;
		}

		ul.mobile-menu {
			display: none;
			flex-direction: column;
			position: fixed;
			top: var(--height-main-menu);
			left: 0;
			right: 0;
			bottom: 0;
			background: var(--clr-leather-dark);
			height: 100vh;
			padding: 0;
			z-index: 999;
			justify-content: flex-start;
			align-items: flex-start;
			overflow: hidden;
		}

		nav.mobile-menu-open ul.mobile-menu {
			display: flex;
		}

		li {
			width: 100%;
			height: auto;
			justify-content: flex-start;
		}

		.dropdown {
			display: flex;
			flex-direction: column;
		}

		.dropdown-menu {
			position: static;
			box-shadow: none;
			display: none;
			width: 100%;
			padding-left: var(--space-md);
			margin-top: 0;
		}

		.dropdown.active .dropdown-menu {
			display: flex;
		}

		.dropdown-button {
			text-align: left;
			padding-left: var(--space-md);
			order: 0;
		}

		.dropdown-menu a {
			padding-left: var(--space-md);
		}
	}
</style>