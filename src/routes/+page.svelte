<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { geojson } from '$lib/worldGeometry';
	import { onDestroy, onMount } from 'svelte';
	// import { company } from '$lib/test.yaml';
	import data from '../content/memories.json';
	import pin1 from '../content/pins/pin1.svg';
	import pin2 from '../content/pins/pin2.svg';
	import pin3 from '../content/pins/pin3.svg';
	import pin4 from '../content/pins/pin4.svg';
	import pin5 from '../content/pins/pin5.svg';
	import pin6 from '../content/pins/pin6.svg';
	import visitedCountries from '$lib/visited-countries.json';

	import { Memory } from '$lib';
	import ImageSingle from '$lib/components/ImageSingle.svelte';
	import { modalStore } from '$lib/stores/modal';

	let mapElement: any = $state();
	let map: any;
	let worldLayer: any;
	let customIcon: any;
	let L: any; // Declare L as a module-level variable
	let selectedCountry = $state<{ name: string } | null>(null);
	let selectedMemory = $state<typeof data.memories[0] | null>(null);
	let clickedElement = $state<HTMLElement | null>(null);
	let infoPanel = $state<HTMLElement | null>(null);
	let initialView = $state<{ center: [number, number]; zoom: number } | null>(null);
	let handleResize: (() => void) | null = null;
	let isMobile = $state(false);
	let isPanelOpen = $state(false); // Replace store with state variable

	const pins = [pin1, pin2, pin3, pin4, pin5, pin6];

	// Import all images using Vite's glob import
	const images = import.meta.glob<{ default: string }>('../content/img/**/*.{jpg,jpeg,png,webp}', { eager: true });

	function getRandomPin() {
		const randomIndex = Math.floor(Math.random() * pins.length);
		return pins[randomIndex];
	}

	function getColor(state: boolean) {
		return state ? '#ffffff' : '#000000';
	}

	function style(feature: any) {
		const isVisited = visitedCountries.countries.includes(feature.properties.name);
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.6,
			fillColor: getColor(isVisited)
		};
	}

	function highlightFeature(e: any) {
		let layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dash: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();
	}

	function resetHighlight(e: any) {
		worldLayer.resetStyle(e.target);
	}

	function zoomToFeature(e: any) {
		map.fitBounds(e.target.getBounds());
	}

	function createCustomIcon(leaflet: any, pinUrl: string) {
		return leaflet.icon({
			iconUrl: pinUrl,
			iconSize: [32, 32],
			iconAnchor: [16, 32],
			popupAnchor: [0, -32]
		});
	}

	function fitBoundsWithPanel() {
		if (!map || !worldLayer || !selectedCountry) return;
		
		const activeLayers = worldLayer.getLayers().filter((layer: any) => 
			layer.feature.properties.name === selectedCountry?.name
		);
		
		if (activeLayers.length > 0) {
			const featureGroup = L.featureGroup(activeLayers);
			
			if (isMobile) {
				// On mobile, use paddingTopLeft to position at top
				map.fitBounds(featureGroup.getBounds(), {
					paddingTopLeft: [map.getSize().y * 0.2 - 100, -500],
					maxZoom: 4
				});
			} else {
				// On desktop, use paddingTopLeft for panel
				const panelWidth = infoPanel?.offsetWidth || 0;
				map.fitBounds(featureGroup.getBounds(), {
					paddingTopLeft: [panelWidth + 10, 10]
				});
			}
		}
	}

	function handleCountryClick(e: any) {
		const countryName = e.target.feature.properties.name;
		selectedCountry = { name: countryName };
		
		// Check if mobile and set panel state with delay
		if (isMobile) {
			setTimeout(() => {
				isPanelOpen = true;
			}, 1000);
		} else {
			isPanelOpen = true;
		}
		
		// Use requestAnimationFrame to ensure panel is rendered before adjusting bounds
		requestAnimationFrame(fitBoundsWithPanel);
	}

	function closePanel() {
		selectedCountry = null;
		isPanelOpen = false;
		if (map && initialView) {
			map.setView(initialView.center, initialView.zoom);
		}
	}

	function onEachFeature(feature: any, layer: any) {
		const isVisited = visitedCountries.countries.includes(feature.properties.name);
		
		if (isVisited) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: handleCountryClick
			});

			// Add marker for visited countries with random pin
			const coordinates = layer.getBounds().getCenter();
			const randomPinIcon = createCustomIcon(L, getRandomPin());
			const marker = L.marker([coordinates.lat, coordinates.lng], { icon: randomPinIcon })
				.addTo(map)
				.bindPopup(feature.properties.name || 'Visited Country');

			// Connect marker events to country interactions
			marker.on({
				mouseover: () => highlightFeature({ target: layer }),
				mouseout: () => resetHighlight({ target: layer }),
				click: () => handleCountryClick({ target: layer })
			});
		} else {
			// Make non-visited countries non-interactive
			layer.options.interactive = false;
		}
	}

	function getMemoriesForCountry(countryName: string) {
		const countryMemories = data.memories.filter(memory => memory.country === countryName);
		if (countryMemories.length === 0) return null;

		// Group by city
		const cityGroups = countryMemories.reduce((acc: { [key: string]: any[] }, memory) => {
			const city = memory.city;
			if (!acc[city]) acc[city] = [];
			acc[city].push(memory);
			return acc;
		}, {});

		// Sort memories within each city by date
		Object.keys(cityGroups).forEach(city => {
			cityGroups[city].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		});

		return cityGroups;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
	}

	function sanitizeGalleryId(date: string) {
		// Replace invalid CSS selector characters with hyphens
		return `memory-${date.replace(/[^a-zA-Z0-9-]/g, '-')}`;
	}

	function getImageData(imagePath: string | { path: string; width: number; height: number }) {
		const path = typeof imagePath === 'string' ? imagePath : imagePath.path;
		const imageKey = `../content/img/${path}`;
		const image = images[imageKey];
		
		if (!image) {
			console.error(`Image not found: ${imageKey}`);
			return {
				thumbnailURL: '',
				largeURL: '',
				width: undefined,
				height: undefined
			};
		}

		return {
			thumbnailURL: image.default,
			largeURL: image.default,
			width: typeof imagePath === 'string' ? undefined : imagePath.width,
			height: typeof imagePath === 'string' ? undefined : imagePath.height
		};
	}

	function handleMemoryClick(memory: typeof data.memories[0], event: MouseEvent) {
		const processedMemory = {
			...memory,
			featuredImage: memory.featuredImage ? getImageData(memory.featuredImage) : undefined
		};
		modalStore.set({
			selectedMemory: processedMemory,
			clickedElement: event.currentTarget as HTMLElement
		});
		document.body.style.overflow = 'hidden';
	}

	function checkMobile() {
		if (browser) {
			isMobile = window.innerWidth <= 768;
		}
	}

	onMount(async () => {
		if (browser) {
			// Check if mobile on mount
			checkMobile();
			
			// Add resize handler for mobile check
			window.addEventListener('resize', checkMobile);

			const leaflet = await import('leaflet');
			L = leaflet;

			// Add resize handler
			handleResize = () => {
				if (selectedCountry) {
					fitBoundsWithPanel();
				}
			};

			window.addEventListener('resize', handleResize);

			map = leaflet
				.map(mapElement, {
					scrollWheelZoom: false,
					zoomControl: false
				})
				.setView([51, -0], 2);

			// Store initial view
			initialView = {
				center: map.getCenter(),
				zoom: map.getZoom()
			};

			// Add zoom control to top right
			leaflet.control.zoom({ 
				position: 'topright'
			}).addTo(map);

			leaflet
				.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
					attribution:
						'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
					minZoom: 1,
					maxZoom: 16
				})
				.addTo(map);
			worldLayer = leaflet
				.geoJSON(geojson as GeoJSON.GeoJsonObject, {
					style,
					onEachFeature: onEachFeature
				})
				.addTo(map);
		}
	});

	onDestroy(() => {
		if (handleResize) {
			window.removeEventListener('resize', handleResize);
		}
		if (browser) {
			window.removeEventListener('resize', checkMobile);
		}
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<main class="container">
	<section class="map-container">
		<h1>Log</h1>
		<div class="map-wrapper">
			<div class="leaflet" bind:this={mapElement}></div>
			{#if selectedCountry}
				<div class="info-panel" class:mobile={isMobile} class:open={isPanelOpen} bind:this={infoPanel}>
					<div class="panel-header">
						<h2>{selectedCountry.name}</h2>
						<button class="close-button" onclick={closePanel}>×</button>
					</div>
					{#if getMemoriesForCountry(selectedCountry.name)}
						{#each Object.entries(getMemoriesForCountry(selectedCountry.name) || {}) as [city, memories]}
							<div class="city-group">
								<h3>{city}</h3>
								<ul class="memories-list">
									{#each memories as memory, i}
										<li class="memory-item">
											{#if memory.featuredImage}
												<div class="featured-image">
													<ImageSingle 
														galleryID={`memory-${selectedCountry.name}-${city}-${i}`}
														images={[getImageData(memory.featuredImage)]}
													/>
												</div>
											{/if}
											<div class="memory-header">
												<div class="title-wrapper">
													<time datetime={memory.date}>{formatDate(memory.date)}</time> - 
													{memory.title}
												</div>
											</div>
											<p class="description">{memory.description}</p>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					{:else}
						<p class="no-memories">No memories listed... Yet. :D</p>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<section class="content">
		<h2>Memories</h2>
		
		<ul class="memories">
			{#each data.memories as memory}
				<li>
					<a href="#open-modal" onclick={(e) => { e.preventDefault(); handleMemoryClick(memory, e); }}>
						<time datetime={memory.date}>{new Date(memory.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</time>
						<span class="title">{memory.title}</span>
						<div class="memory-icons">
							{#if memory.images && memory.images.length > 0}
								<svg class="icon gallery-icon" viewBox="0 0 24 24" width="20" height="20">
									<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
								</svg>
							{/if}
							{#if memory.isEscapeRoom}
								<svg class="icon escape-icon" viewBox="0 0 24 24" width="20" height="20">
									<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
								</svg>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	:global {
		@import 'leaflet/dist/leaflet.css';
	}

	main {
		margin: var(--space-xl) 0;
		background-color: var(--clr-paper-light);
		margin: var(--space-xxxl) auto;
	}

	main .leaflet {
		height: 700px;
		width: 100%;
		max-width: var(--width-site);
		margin: 0 auto;
		border: 8px solid #fff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.2);
	}

	h1,
	h2 {
		font-family: 'Fredericka the Great', cursive;
		text-transform: uppercase;
	}

	.content {
		padding: var(--space-lg);
		width: 100%;
		max-width: var(--width-content);
		margin: 0 auto;
	}

	p {
		margin-top: 1rem;
		font-family: "Domine", serif;
	}

	/* p {
		font-family: 'Pridi', serif;
		font-weight: 200;
	} */

	.memories {
		list-style: none;
		padding: 0;
		margin: var(--space-lg) 0;
	}

	.memories li {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
		font-family: "Domine", serif;
		padding: var(--space-xs) var(--space-sm);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.5s ease;
	}

	.memories li:hover {
		background-color: var(--clr-aged-paper);
		font-weight: 1000;
	}

	.memories a {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-xs) var(--space-sm);
		text-decoration: none;
		color: inherit;
		transition: inherit;
		width: 100%;
	}

	.memories li:hover a {
		background-color: var(--clr-aged-paper);
		font-weight: 1000;
	}

	.memory-icons {
		display: flex;
		gap: 8px;
		margin-left: auto;
		align-items: center;
		min-width: 48px;
		justify-content: flex-end;
	}

	.icon {
		fill: currentColor;
		transition: inherit;
	}

	.memories time {
		font-variant-numeric: tabular-nums;
		min-width: 100px;
		flex-shrink: 0;
		transition: inherit;
	}

	.memories .title {
		flex: 1;
		transition: inherit;
	}

	.map-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.map-wrapper {
		position: relative;
		width: 100%;
		height: 700px; /* Desktop height */
	}

	.leaflet {
		height: 100%;
		width: 100%;
		border: 8px solid #fff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.2);
	}

	.info-panel {
		position: absolute;
		z-index: 999;
		top: 10px;
		left: 10px;
		bottom: 10px;
		width: 30%;
		background: #fff;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 0 10px 10px rgba(0, 140, 255, 0.2);
		overflow-y: auto;
		transition: transform 0.3s ease-in-out;
	}

	.info-panel.mobile {
		width: 100%;
		left: 0;
		right: 0;
		bottom: 0;
		top: auto;
		height: 80vh;
		border-radius: 20px 20px 0 0;
		transform: translateY(100%);
	}

	.info-panel.mobile.open {
		transform: translateY(0);
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-lg);
		position: relative;
	}

	.panel-header h2 {
		margin: 0;
		font-size: 2rem;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 2rem;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: var(--clr-paper-dark);
		color: var(--clr-text);
	}

	.info-panel h3 {
		font-family: "Domine", serif;
		font-size: 1.2rem;
		margin: var(--space-md) 0 var(--space-sm);
	}

	.city-group {
		margin-bottom: var(--space-lg);
	}

	.memories-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.memory-item {
		padding: var(--space-sm);
		margin-bottom: var(--space-md);
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.memory-item:hover {
		background-color: var(--clr-paper-dark);
	}

	.memory-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.memory-header time {
		font-family: "Domine", serif;
		font-variant-numeric: tabular-nums;
		color: var(--clr-text);
		min-width: 100px;
		font-weight: 500;
		flex-shrink: 0;
	}

	.memory-item .description {
		font-family: "Domine", serif;
		color: var(--clr-text-muted);
		font-size: 0.9em;
		margin: 0;
		padding-left: 0;
		margin-top: var(--space-xs);
	}

	.no-memories {
		font-family: "Domine", serif;
		font-style: italic;
		margin: var(--space-lg) 0;
	}

	.featured-image {
		margin-bottom: var(--space-sm);
		border-radius: 4px;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.map-wrapper {
			height: fit-content
		}

		.leaflet {
			height: 100%;
			border: none;
			box-shadow: none;
		}

		/* Adjust zoom controls for mobile */
		:global(.leaflet-control-zoom) {
			margin: 10px !important;
		}

		:global(.leaflet-control-zoom a) {
			width: 34px !important;
			height: 34px !important;
			line-height: 34px !important;
			font-size: 22px !important;
		}
	}
</style>
