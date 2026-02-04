<script lang="ts">
	interface Props {
		name: string;
		slug: string;
		baseUrl: string;
	}

	let { name, slug, baseUrl }: Props = $props();

	const previousUrl = `${baseUrl}/${slug}/previous`;
	const nextUrl = `${baseUrl}/${slug}/next`;
</script>

<div class="webring">
	<a href={previousUrl} class="webring-arrow" aria-label="Previous site in {name}">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
			<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
		</svg>
	</a>
	<a href={baseUrl} class="webring-name">{name}</a>
	<a href={nextUrl} class="webring-arrow" aria-label="Next site in {name}">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
			<path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
		</svg>
	</a>
</div>

<style>
	.webring {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		background: rgba(0, 0, 0, 0.05);
		border-radius: var(--radius-corner);
	}

	.webring-name {
		font-family: 'Special Elite', system-ui;
		font-size: 1rem;
		color: var(--clr-ink-brown);
		text-decoration: none;
	}

	.webring-name:hover {
		text-decoration: underline;
	}

	.webring-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		color: #079992;
		transition: transform 0.2s ease;
	}

	.webring-arrow:hover {
		transform: scale(1.2);
	}

	.webring-arrow svg {
		width: 24px;
		height: 24px;
	}
</style>
