<script lang="ts">
	import { onMount } from 'svelte';
	import escapeRoomsData from '../../content/escape-rooms.json';
	import { debounce } from '$lib/utils';

	interface Location {
		city: string;
		nation: string;
		country?: string;
		venue: string;
	}

	interface EscapeRoom {
		id: string;
		name: string;
		location: Location;
		overallRating: number;
		hostDifficulty: string;
		ourDifficulty: string;
		gmRating: number;
		themeRating: number;
		teamSize: number;
		review: string;
		highlights: string[];
		visitedDate: string;
	}

	interface EscapeRoomsData {
		escapeRooms: EscapeRoom[];
	}

	let searchQuery = $state('');
	let filteredRooms = $state<EscapeRoom[]>((escapeRoomsData as EscapeRoomsData).escapeRooms);
	let selectedNation = $state('');
	let sortOrder = $state<'newest' | 'oldest'>('newest');
	let searchTimeout: ReturnType<typeof setTimeout>;

	const nations = [
		...new Set(
			(escapeRoomsData as EscapeRoomsData).escapeRooms.map(
				(room: EscapeRoom) => room.location.nation
			)
		)
	].sort();

	const nationCodes: Record<string, string> = {
		Germany: 'DE',
		Japan: 'JP',
		Spain: 'ES',
		'United Kingdom': 'GB',
		USA: 'US'
	};

	function getNationFlag(nation: string): string {
		const code = nationCodes[nation];
		if (!code) return '';

		const codePoints = code
			.toUpperCase()
			.split('')
			.map((char) => 127397 + char.charCodeAt(0));

		return String.fromCodePoint(...codePoints);
	}

	function sortRooms(rooms: EscapeRoom[]) {
		return [...rooms].sort((a, b) => {
			const dateA = new Date(a.visitedDate).getTime();
			const dateB = new Date(b.visitedDate).getTime();
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});
	}

	function filterRooms() {
		const query = searchQuery.toLowerCase().trim();
		const searchTerms = query.split(/\s+/).filter((term) => term.length > 0);

		const filtered = (escapeRoomsData as EscapeRoomsData).escapeRooms.filter((room: EscapeRoom) => {
			const matchesNation = selectedNation === '' || room.location.nation === selectedNation;
			if (!matchesNation) return false;

			if (searchTerms.length === 0) return true;

			const searchableText = [
				room.name,
				room.location.city,
				room.location.nation,
				room.location.country,
				room.location.venue,
				room.review,
				room.hostDifficulty,
				room.ourDifficulty,
				...room.highlights
			]
				.join(' ')
				.toLowerCase();

			return searchTerms.every((term) => searchableText.includes(term));
		});

		filteredRooms = sortRooms(filtered);
	}

	const debouncedFilter = debounce(filterRooms, 200);

	function handleSearch() {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(debouncedFilter, 200);
	}

	function clearSearch() {
		searchQuery = '';
		handleSearch();
	}

	function resetFilters() {
		searchQuery = '';
		selectedNation = '';
		sortOrder = 'newest';
		handleSearch();
	}

	function handleSortChange() {
		filteredRooms = sortRooms(filteredRooms);
	}

	onMount(() => {
		filterRooms();
	});
</script>

<main class="container">
	<section>
		<div class="content">
			<div class="container-title">
				<h1>Escape Rooms</h1>
				<div class="title-lines"></div>
			</div>

			<p><em>Please bear in mind that the list is still being compiled, and I'm certainly going to be taking a while.</em></p>

			<p>
				The content on this page is a work in progress, and honestly completely arbitrary. 🤣 I (and
				friends) rate the rooms based on how much fun we had, and on the overall experience. Some
				notes:
			</p>

			<ul>
				<li>Host's difficulty: The company's difficulty rating on their website.</li>
				<li>Our difficulty rating: Our own rating based on how difficult we found the room.</li>
				<li>GM: How well the GM interacted with us.</li>
				<li>Theme: How well the theme was executed.</li>
				<li>Team size: The number of people in our group.</li>
			</ul>
		</div>
	</section>

	<section>
		<div class="content">
			<div class="search-container">
				<div class="search-wrapper">
					<input
						type="text"
						bind:value={searchQuery}
						oninput={handleSearch}
						placeholder="Search by name, city, country, venue, or keywords..."
						class="search-input"
						aria-label="Search escape rooms"
					/>
					{#if searchQuery}
						<button class="clear-search" onclick={clearSearch} aria-label="Clear search">
							×
						</button>
					{/if}
				</div>
				<div class="filters">
					<select
						bind:value={selectedNation}
						onchange={handleSearch}
						class="country-select"
						aria-label="Filter by nation"
					>
						<option value="">All countries</option>
						{#each nations as nation}
							<option value={nation}>
								{getNationFlag(nation)}
								{nation}
							</option>
						{/each}
					</select>
					<select
						bind:value={sortOrder}
						onchange={handleSortChange}
						class="sort-select"
						aria-label="Sort by date"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
					</select>
				</div>
			</div>

			{#if filteredRooms.length === 0}
				<div class="no-results">
					<p>No escape rooms found matching your search criteria.</p>
					<button class="reset-filters" onclick={resetFilters}> Reset Filters </button>
				</div>
			{/if}

			<div class="rooms-list">
				{#each filteredRooms as room (room.id)}
					<article class="room-entry">
						<header class="room-header">
							<div class="room-title">
								<h2>{room.name}</h2>
								<time datetime={room.visitedDate} class="visited-date">
									{new Date(room.visitedDate).toLocaleDateString()}
								</time>
							</div>
							<div class="room-location">
								{room.location.venue} - {room.location.city}
								{#if room.location.country}
									, {room.location.country}
								{/if}
								, {room.location.nation}
							</div>
							<div class="room-meta">
								<div class="ratings">
									<span class="overall-rating">Overall: ⭐ {room.overallRating}/5</span>
									<span class="gm-rating">GM: ⭐ {room.gmRating}/5</span>
									<span class="theme-rating">Theme: ⭐ {room.themeRating}/5</span>
								</div>
							</div>
						</header>

						<p class="review">{room.review}</p>

						<div class="room-details">
							<span class="host-difficulty">Host Difficulty: {room.hostDifficulty}</span>
							<span class="our-difficulty">Our Difficulty: {room.ourDifficulty}</span>
							<span class="team-size">Team Size: {room.teamSize} people</span>
						</div>

						<div class="highlights">
							{#each room.highlights as highlight}
								<span class="highlight-tag">{highlight}</span>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	section {
		margin: var(--space-xl) 0;
		background-color: var(--clr-light-parchment);
		margin: var(--space-xxxl) auto;
		padding: var(--space-xxxl);
		box-shadow:
			-4px 4px 4px rgba(0, 0, 0, 0.4),
			-2px 2px 2px rgba(0, 0, 0, 0.2);
	}

	.container-title {
		margin-top: var(--space-lg);
	}

	.title-lines {
		margin-bottom: var(--space-xxl);
	}

	.search-container {
		display: flex;
		margin-top: var(--space-xl);
		gap: 1rem;
		margin-bottom: var(--space-xl);
		padding: 0 var(--space-md);
	}

	.search-wrapper {
		position: relative;
		flex: 1;
	}

	.search-wrapper input {
		border: 2px solid var(--clr-ink-black);
		border-radius: 2px;
		width: 100%;
	}

	.search-input {
		flex: 1;
		padding: var(--space-sm) var(--space-md);
		border: 2px solid var(--clr-accent);
		border-radius: var(--radius-sm);
		font-size: 1rem;
		font-family: inherit;
		background-color: var(--clr-paper);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--clr-accent-dark);
	}

	.filters {
		display: flex;
		gap: var(--space-md);
	}

	.country-select,
	.sort-select {
		padding: var(--space-sm) var(--space-md);
		border: 2px solid var(--clr-border);
		border-radius: var(--radius-sm);
		font-size: 1rem;
		min-width: 160px;
		font-family: inherit;
		background-color: var(--clr-paper);
	}

	.country-select option {
		padding: var(--space-xs) var(--space-sm);
	}

	.rooms-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		padding: 0 var(--space-md);
	}

	.room-entry {
		background-color: var(--clr-paper);
		padding: var(--space-lg);
		border-radius: var(--radius-md);
		border: 1px solid var(--clr-border);
	}

	.room-header {
		margin-bottom: var(--space-md);
	}

	.room-title {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-sm);
	}

	.room-title h2 {
		color: var(--clr-text);
		margin: 0;
		font-size: 1.5rem;
	}

	.visited-date {
		color: var(--clr-text-light);
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.room-meta {
		margin-bottom: var(--space-sm);
	}

	.ratings {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		font-size: 0.9rem;
		color: var(--clr-text-light);
	}

	.overall-rating {
		color: var(--clr-accent);
		font-weight: 600;
	}

	.room-details {
		margin: var(--space-md) 0;
		padding: var(--space-md) 0;
		background-color: var(--clr-bg-light);
		border-radius: var(--radius-sm);
		display: flex;
		gap: var(--space-xl);
		font-size: 0.9rem;
		color: var(--clr-text);
		flex-wrap: wrap;
	}

	.host-difficulty,
	.our-difficulty,
	.team-size {
		white-space: nowrap;
	}

	.room-location {
		color: var(--clr-text-light);
		font-size: 0.9rem;
		margin-top: var(--space-xs);
		margin-bottom: var(--space-md);
	}

	.review {
		color: var(--clr-text);
		margin: var(--space-md) 0;
	}

	.highlights {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin: var(--space-md) 0;
	}

	.highlight-tag {
		background: var(--clr-bg-light);
		color: var(--clr-text);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-full);
		font-size: 0.85rem;
	}

	.highlight-tag:first-child {
		padding-left: 0;
	}

	.clear-search {
		position: absolute;
		right: var(--space-md);
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--clr-text-light);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0 var(--space-xs);
		border-radius: var(--radius-full);
	}

	.clear-search:hover {
		background-color: var(--clr-bg-light);
		color: var(--clr-text);
	}

	.no-results {
		text-align: center;
		padding: var(--space-xl);
		color: var(--clr-text-light);
	}

	.reset-filters {
		margin-top: var(--space-md);
		padding: var(--space-sm) var(--space-lg);
		background-color: var(--clr-bg-light);
		border: 1px solid var(--clr-border);
		border-radius: var(--radius-sm);
		color: var(--clr-text);
		cursor: pointer;
		font-family: inherit;
		font-size: 0.9rem;
	}

	.reset-filters:hover {
		background-color: var(--clr-border);
	}

	@media (max-width: 768px) {
		.search-container {
			flex-direction: column;
		}

		.filters {
			flex-direction: column;
			width: 100%;
		}

		.country-select,
		.sort-select {
			width: 100%;
		}

		.room-title {
			flex-direction: column;
			gap: var(--space-xs);
		}

		.visited-date {
			align-self: flex-start;
		}

		.ratings {
			flex-direction: column;
			gap: var(--space-xs);
		}

		.room-details {
			padding: var(--space-sm) 0;
		}

		main {
			padding: var(--space-lg);
		}

		.rooms-list {
			padding: 0;
		}

		.room-entry {
			padding: var(--space-md);
		}
	}
</style>
