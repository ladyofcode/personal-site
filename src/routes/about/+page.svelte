<script lang="ts">
	import IconInstagram from '@svicons/ionicons-solid/logo-instagram.svelte';
	import IconGithub from '@svicons/ionicons-solid/logo-github.svelte';
	import IconTwitter from '@svicons/ionicons-solid/logo-twitter.svelte';
	import IconTwitch from '@svicons/ionicons-solid/logo-twitch.svelte';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main class="container">
	<h1>A bit about me</h1>

	<p>
		I'm a developer and designer currently based in Canberra, Australia. I love gaming, travelling,
		learning to play guitar, and building communities. If you're curious about my tech profile, you
		can view that <a href="https://ladyofcode.com/about">on my other site</a>.
	</p>

	<h2>Find me here</h2>
	<div id="links">
		<a href="https://twitter.com/ladyofcode"><IconTwitter color="#079992" width="40px" /></a>
		<a href="https://twitch.tv/ladyofcode"><IconTwitch color="#079992" width="40px" /></a>
		<a href="https://github.com/ladyofcode"><IconGithub color="#079992" width="40px" /></a>
		<a href="https://www.instagram.com/ladyofcode/"
			><IconInstagram color="#079992" width="40px" /></a
		>
	</div>

	<h2>What I'm up to these days</h2>
	<ul>
		<li>Hosting workshops, streams, and projects at Artifex.</li>
		<li>Building <a href="https://inatlantis.io">the Atlantis community</a>.</li>
		<li><a href="https://twitch.tv/ladyofcode">Streaming</a> and working on content creation.</li>
		<li>Developing kickass community software at Grid.</li>
		<li>Learning guitar.</li>
	</ul>

	<h2>Random trivia</h2>
	<ul>
		<li>
			Australia is my fifth country of residence! I'm from South Africa, and lived in Saudi Arabia,
			Bahrain, and Malaysia.
		</li>
		<li>
			My earliest computer memory is using MS Paint for the first time. I was three years old. I
			tried sneaking onto the computer when Dad wasn't around but opened up Internet Explorer
			instead. I remember being disappointed and then gave up immediately because I had no idea how
			to find it on the computer.
		</li>
		<li>I've been leading a video gaming guild for ~15 years. They're my fam 💖.</li>
	</ul>
</main>

<style>
	main {
		margin: var(--space-xl) 0;
		background-color: var(--clr-paper-light);
		margin: var(--space-xxxl) auto;
		font-family: 'Domine', serif;
		padding: var(--space-xxxl);
		box-shadow: -4px 4px 4px rgba(0, 0, 0, 0.4), -2px 2px 2px rgba(0, 0, 0, 0.2);
	}

	main > * {
		max-width: (--width-content);
		margin: 0 auto;
	}
	
	h2 {
		margin-top: var(--space-lg);
	}

	#links {
		display: flex;
		flex-direction: row;
		gap: var(--space-lg);
	}
</style>
