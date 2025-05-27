<script>
	const items = [
		{ title: 'Japanese', path: 'japanese', start: 'April 2024' },
		{ title: 'Guitar', path: 'guitar', start: 'Jan 2024' },
		{ title: 'Health', path: 'health', start: 'Sep 2023' },
		{ title: 'Illustration', path: 'illustration', start: 'May 2023' },
		{ title: 'Grid', path: 'grid', start: 'Jan 2023' },
		{ title: 'Writing', path: 'writing', start: 'Sep 2022' },
		{ title: 'Music', path: 'music', start: 'May 2022' },
		{ title: 'User experience', path: 'user-experience', start: 'Jan 2022' },
		{ title: 'Three.js', path: 'threejs', start: 'Sep 2021' },
		{ title: 'UI design', path: 'ui-design', start: 'April 2021' },
		{ title: 'Code', path: 'code', start: 'Jan 2021' }
	];
</script>

<svelte:head>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<main class="desk">
	<section class="container">
		<div class="title-paper">
			<h1>100 Days</h1>
		</div>

		<div class="description">
			<p>
				The challenge: keep momentum on the same thing for 100 days straight. We're on round 12 -
				join us <a href="https://inatlantis.io/community">in Atlantis</a> if you think you're cut out
				for it!
			</p>
		</div>

		<ul>
			{#each items as item}
				<li>
					<a href="/100-days/{item.path}">{item.title}</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	.description {
		height: fit-content;
		width: fit-content;
		filter: drop-shadow(-6px 6px 6px rgba(0, 0, 0, 0.1))
			drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.4));
	}

	.title-paper {
		padding-right: 2rem;
	}

	h1 {
		background-color: var(--clr-paper-light);
	}

	p {
		width: 100%;
		max-width: 700px;
		background-color: var(--clr-paper-light);
		padding: 1rem 2rem;
		clip-path: polygon(5px 4.75%, 95.65% 2px, 95.8% 96.75%, 0.1% 99.75%);
		font-weight: 200;
		margin-bottom: 4rem;
	}

	p,
	li,
	a {
		font-family: 'Special Elite', system-ui, serif;
	}

	ul {
		height: 100%;
		padding: 2rem 0;
		list-style-type: none;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: masonry;
		gap: 4rem;
	}

	li {
		height: fit-content;
		width: fit-content;
		filter: drop-shadow(-6px 6px 6px rgba(0, 0, 0, 0.1))
			drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.4));
	}

	li > a {
		background-color: var(--clr-paper-light);
		text-decoration: none;
		color: var(--clr-ink-black);
		padding: 1rem 2rem;
		display: block;
		width: fit-content;
		font-size: 2rem;
	}

	li:nth-child(odd) > a {
		clip-path: polygon(2px 11%, 95.65% 2px, 95.8% 96.75%, 0.1% 99.75%);
	}

	li:nth-child(even) > a {
		clip-path: polygon(2px 6%, 95.65% 3px, 95.8% 96.75%, 1.53% 99.75%);
	}

	li:nth-child(odd):hover {
		transform: scale(1.1) rotate(6deg);
	}

	li:nth-child(even):hover {
		transform: scale(1.1) rotate(-6deg);
	}

	/* For tablets and larger screens */
	@media (min-width: 600px) {
		ul {
			grid-template-columns: repeat(2, 1fr); /* 3 columns on medium screens */
		}
	}

	/* For mobile devices */
	@media (min-width: 1024px) {
		ul {
			grid-template-columns: repeat(3, 1fr); /* 2 columns on smaller screens */
		}
	}

	@media (min-width: 1200px) {
		ul {
			grid-template-columns: repeat(4, 1fr); /* 2 columns on smaller screens */
		}
	}
</style>
