<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { geojson } from '$lib/worldGeometry';
	import { onDestroy, onMount } from 'svelte';
	import { gsap } from 'gsap';
	// import { company } from '$lib/test.yaml';
	import data from '../content/memories.json';
	import pin1 from '../content/pins/pin1.svg';
	import pin2 from '../content/pins/pin2.svg';
	import pin3 from '../content/pins/pin3.svg';
	import pin4 from '../content/pins/pin4.svg';
	import pin5 from '../content/pins/pin5.svg';
	import pin6 from '../content/pins/pin6.svg';
	import book1 from '$lib/img/book_tear1.png';
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
	let selectedMemory = $state<(typeof data.memories)[0] | null>(null);
	let clickedElement = $state<HTMLElement | null>(null);
	let infoPanel = $state<HTMLElement | null>(null);
	let initialView = $state<{ center: [number, number]; zoom: number } | null>(null);
	let handleResize: (() => void) | null = null;
	let isMobile = $state(false);
	let isPanelOpen = $state(false); // Replace store with state variable
	let mainContainer: HTMLElement;

	const pins = [pin1, pin2, pin3, pin4, pin5, pin6];

	// Import all images using Vite's glob import
	const images = import.meta.glob<{ default: string }>('../content/img/**/*.{jpg,jpeg,png,webp}', {
		eager: true
	});

	function getRandomPin() {
		const randomIndex = Math.floor(Math.random() * pins.length);
		return pins[randomIndex];
	}

	function getColor(state: boolean) {
		return state ? '#f0dcaf' : '#000000';
	}

	function style(feature: any) {
		const isVisited = visitedCountries.countries.includes(feature.properties.name);
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.4,
			fillColor: getColor(isVisited)
		};
	}

	function highlightFeature(e: any) {
		let layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#696255',
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

		const activeLayers = worldLayer
			.getLayers()
			.filter((layer: any) => layer.feature.properties.name === selectedCountry?.name);

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
				mouseover: (e: L.LeafletMouseEvent) => {
					highlightFeature({ target: layer });
					e.target.openPopup();
				},
				mouseout: (e: L.LeafletMouseEvent) => {
					resetHighlight({ target: layer });
					e.target.closePopup();
				},
				click: () => handleCountryClick({ target: layer })
			});
		} else {
			// Make non-visited countries non-interactive
			layer.options.interactive = false;
		}
	}

	function getMemoriesForCountry(countryName: string) {
		const countryMemories = data.memories.filter((memory) => memory.country === countryName);
		if (countryMemories.length === 0) return null;

		// Group by city
		const cityGroups = countryMemories.reduce((acc: { [key: string]: any[] }, memory) => {
			const city = memory.city;
			if (!acc[city]) acc[city] = [];
			acc[city].push(memory);
			return acc;
		}, {});

		// Sort memories within each city by date
		Object.keys(cityGroups).forEach((city) => {
			cityGroups[city].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		});

		return cityGroups;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
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

	function handleMemoryClick(memory: (typeof data.memories)[0], event: MouseEvent, i: number) {
		const processedMemory = {
			...memory,
			featuredImage: memory.featuredImage ? getImageData(memory.featuredImage) : undefined
		};
		modalStore.set({
			selectedMemory: processedMemory,
			clickedElement: event.currentTarget as HTMLElement,
			memoryIndex: i
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
			// Initial opacity 0 for all direct children
			gsap.set(mainContainer.children, { autoAlpha: 0 });

			// Fade in animation for all direct children
			gsap.to(mainContainer.children, {
				autoAlpha: 1,
				duration: 0.2,
				ease: 'power2.out',
				stagger: 0.05 // Optional: stagger the fade-in of each child
			});

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
					zoomControl: false,
					maxBounds: [
						[-90, -180],
						[90, 180]
					],
					maxBoundsViscosity: 1.0
				})
				.setView([43, 0], 2);

			// Store initial view
			initialView = {
				center: map.getCenter(),
				zoom: map.getZoom()
			};

			// Add zoom control to top right
			leaflet.control
				.zoom({
					position: 'topright'
				})
				.addTo(map);

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

<main class="container" bind:this={mainContainer}>
	<section class="map-container">
		<div class="content">
			<div class="container-title">
				<h1>The Log</h1>
				<div class="title-lines"></div>
			</div>
		</div>
		<div class="map-wrapper">
			<div class="washi-tape washi-tape-top"></div>
			<div class="watercolour-stroke watercolour-stroke-top"></div>
			<div class="washi-tape washi-tape-bottom"></div>
			<div class="watercolour-stroke watercolour-stroke-bottom"></div>
			<div class="leaflet" bind:this={mapElement}></div>
			{#if selectedCountry}
				<div
					class="info-panel"
					class:mobile={isMobile}
					class:open={isPanelOpen}
					bind:this={infoPanel}
				>
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
		<div class="camera-sticker"></div>
	</section>

	<section class="content">
		<h2>Memories</h2>

		<p><em>Please bear in mind that the list of memories is still being compiled, and I'm certainly going to be taking a while.</em></p>

		<ul class="memories">
			{#each data.memories as memory, i}
				<li>
					<a
						href="#open-modal"
						onclick={(e) => {
							e.preventDefault();
							handleMemoryClick(memory, e, i);
						}}
					>
						<time datetime={memory.date}
							>{new Date(memory.date).toLocaleDateString('en-GB', {
								month: 'short',
								year: 'numeric'
							})}</time
						>
						<span class="title">{memory.title}</span>
						<div class="memory-icons">
							{#if memory.images && memory.images.length > 0}
								<svg
									class="icon gallery-icon"
									height="20px"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 122.88 98.27"
									><title>photos</title><path
										d="M4.84,27.31H90.76a4.77,4.77,0,0,1,3.4,1.41,4.84,4.84,0,0,1,1.41,3.4V93.47a4.75,4.75,0,0,1-1.41,3.39,1.36,1.36,0,0,1-.25.22,4.67,4.67,0,0,1-3.18,1.19H4.81A4.81,4.81,0,0,1,0,93.47V32.12a4.77,4.77,0,0,1,1.41-3.4,4.83,4.83,0,0,1,3.4-1.41ZM32.15,0h85.92a4.77,4.77,0,0,1,3.4,1.41,4.84,4.84,0,0,1,1.41,3.4V66.16a4.75,4.75,0,0,1-1.41,3.39,1.09,1.09,0,0,1-.25.22A4.67,4.67,0,0,1,118,71h-5.38V65.22h4.51V5.71H33.06v4.2H27.31V4.81a4.77,4.77,0,0,1,1.41-3.4A4.84,4.84,0,0,1,32.12,0ZM18.5,13.66h85.92a4.75,4.75,0,0,1,3.39,1.41,4.8,4.8,0,0,1,1.41,3.39V79.81a4.77,4.77,0,0,1-1.41,3.4,1.4,1.4,0,0,1-.25.22,4.67,4.67,0,0,1-3.18,1.19H99V78.88h4.51V19.37H19.4v4.2H13.65V18.46a4.81,4.81,0,0,1,4.81-4.8ZM24.68,44a6.9,6.9,0,1,1-6.89,6.89A6.89,6.89,0,0,1,24.68,44Zm29,29.59L67.49,49.71,82.14,86.77H13.77V82.18l5.74-.29,5.75-14.08,2.87,10.06h8.62l7.47-19.25L53.7,73.56ZM89.86,33H5.75V92.53H89.86V33Z"
									/></svg
								>
							{/if}
							{#if memory.isEscapeRoom}
								<svg
									class="icon escape-icon"
									height="20px"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 108.01 122.88"
									><defs
										><style>
											.cls-1 {
												fill-rule: evenodd;
											}
										</style></defs
									><title>emergency-exit</title><path
										class="cls-1"
										d="M.5,0H15a.51.51,0,0,1,.5.5V83.38L35.16,82h.22l.24,0c2.07-.14,3.65-.26,4.73-1.23l1.86-2.17a1.12,1.12,0,0,1,1.49-.18l9.35,6.28a1.15,1.15,0,0,1,.49,1c0,.55-.19.7-.61,1.08A11.28,11.28,0,0,0,51.78,88a27.27,27.27,0,0,1-3,3.1,15.84,15.84,0,0,1-3.68,2.45c-2.8,1.36-5.45,1.54-8.59,1.76l-.24,0-.21,0L15.5,96.77v25.61a.52.52,0,0,1-.5.5H.5a.51.51,0,0,1-.5-.5V.5A.5.5,0,0,1,.5,0ZM46,59.91l9-19.12-.89-.25a12.43,12.43,0,0,0-4.77-.82c-1.9.28-3.68,1.42-5.67,2.7-.83.53-1.69,1.09-2.62,1.63-.7.33-1.51.86-2.19,1.25l-8.7,5a1.11,1.11,0,0,1-1.51-.42l-5.48-9.64a1.1,1.1,0,0,1,.42-1.51c3.43-2,7.42-4,10.75-6.14,4-2.49,7.27-4.48,11.06-5.42s8-.8,13.89,1c2.12.59,4.55,1.48,6.55,2.2,1,.35,1.8.66,2.44.87,9.86,3.29,13.19,9.66,15.78,14.6,1.12,2.13,2.09,4,3.34,5,.51.42,1.67.27,3,.09a21.62,21.62,0,0,1,2.64-.23c4.32-.41,8.66-.66,13-1a1.1,1.1,0,0,1,1.18,1L108,61.86A1.11,1.11,0,0,1,107,63L95,63.9c-5.33.38-9.19.66-15-2.47l-.12-.07a23.23,23.23,0,0,1-7.21-8.5l0,0L65.73,68.4a63.9,63.9,0,0,0,5.85,5.32c6,5,11,9.21,9.38,20.43a23.89,23.89,0,0,1-.65,2.93c-.27,1-.56,1.9-.87,2.84-2.29,6.54-4.22,13.5-6.29,20.13a1.1,1.1,0,0,1-1,.81l-11.66.78a1,1,0,0,1-.39,0,1.12,1.12,0,0,1-.75-1.38c2.45-8.12,5-16.25,7.39-24.38a29,29,0,0,0,.87-3,7,7,0,0,0,.08-2.65l0-.24a4.16,4.16,0,0,0-.73-2.22,53.23,53.23,0,0,0-8.76-5.57c-3.75-2.07-7.41-4.08-10.25-7a12.15,12.15,0,0,1-3.59-7.36A14.76,14.76,0,0,1,46,59.91ZM80.07,6.13a12.29,12.29,0,0,1,13.1,11.39v0a12.29,12.29,0,0,1-24.52,1.72v0A12.3,12.3,0,0,1,80,6.13ZM3.34,35H6.69V51.09H3.34V35Z"
									/></svg
								>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
	<div class="bg-decorations">
		<div class="watercolour-bg"></div>
		<div class="washi-tape-bg washi-tape-green"></div>
		<div class="washi-tape-bg washi-tape-black"></div>
		<div class="quote-box">
			<p>
				"Afoot and light-hearted I take to the open road,
				Healthy, free, the world before me..."
			</p>
			<p>— Walt Whitman, <em>Song of the Open Road</em></p>
		</div>
	</div>
</main>

<style>
	:global {
		@import 'leaflet/dist/leaflet.css';

		.leaflet-popup-content-wrapper {
			background-color: var(--clr-light-parchment);
			border-radius: 4px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		}

		.leaflet-popup-content {
			font-family: 'Special Elite', system-ui, serif;
			margin: 8px 12px;
			font-size: 1.1rem;
			color: var(--clr-text);
			padding-top: var(--space-sm);
		}

		.leaflet-popup-tip {
			background-color: var(--clr-light-parchment);
		}

		.leaflet-pane {
			background-color: var(--clr-light-parchment);
		}
	}

	main {
		position: relative;
		margin: var(--space-xl) 0;
		background-color: var(--clr-light-parchment);
		margin: var(--space-xxxl) auto;
		padding: var(--space-xl);
	}

	main > * {
		position: relative;
		z-index: 2;
		opacity: 0; /* Initial opacity for direct children */
	}

	.container-title {
		margin-top: var(--space-xxl);
	}

	.title-lines {
		margin-bottom: var(--space-xxxxl);
	}

	.bg-decorations {
		position: relative;
		inset: 0;
		height: 200px;
		pointer-events: none;
		z-index: 2;
		overflow: visible;
	}

	.watercolour-bg {
		position: absolute;
		left: 0;
		width: 100%;
		max-width: 800px;
		height: 400px;
		background-image: url('$lib/img/watercolour_stroke1.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: bottom left;
		opacity: 0.6;
		mix-blend-mode: multiply;
		transform: rotate(180deg);
		z-index: 1;
	}

	.washi-tape-bg {
		position: absolute;
		top: 0;
		width: 300px;
		height: 80px;
		opacity: 0.9;
		pointer-events: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 2;
	}

	.washi-tape-green {
		top: 0px;
		width: 80%;
		max-width: 400px;
		left: 60px;
		background-color: #2c4a1d;
		transform: rotate(-1deg);
	}

	.washi-tape-black {
		top: 40px;
		left: 80px;
		width: 80%;
		max-width: 480px;
		background-color: #000;
	}

	.washi-tape-black::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, #fff 1px, transparent 1px);
		background-size: 8px 8px;
		opacity: 0.3;
	}

	.washi-tape-green::after,
	.washi-tape-black::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.1) 100%
		);
		pointer-events: none;
	}

	.quote-box {
		position: absolute;
		top: 60px;
		left: 100px;
		width: fit-content;
		max-width: 400px;
		background-color: var(--clr-paper-light);
		padding: 2rem 2rem;
		clip-path: polygon(2px 11%, 95.65% 2px, 95.8% 96.75%, 0.1% 99.75%);
		z-index: 3;
		filter: drop-shadow(-6px 6px 6px rgba(0, 0, 0, 0.1))
			drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.4));
	}

	.quote-box p {
		margin: 0;
		font-style: italic;
		font-size: 1.2rem;
		line-height: 1.4;
		color: var(--clr-text);
		font-family: 'Special Elite', system-ui, serif;
	}

	main::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: -1rem;
		width: 600px;
		height: 36%;
		opacity: 0.7;
		background-image: url('$lib/img/book_tear1.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: bottom right;
		pointer-events: none;
		overflow: hidden;
		z-index: 1;
	}

	.leaflet {
		z-index: 100;
	}

	.camera-sticker {
		position: relative;
		width: 200px;
		height: 200px;
		margin: -100px 0 0 -50px;
		background-image: url('$lib/img/sticker_camera.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: left center;
		pointer-events: none;
		transform: rotate(-15deg);
		z-index: 1000;
		filter: drop-shadow(2px 4px 2px rgba(0, 0, 0, 0.2));
	}



	main .leaflet {
		height: 700px;
		width: 100%;
		max-width: var(--width-site);
		margin: 0 auto;
		border: 8px solid #fff;
		box-shadow:
			0px 4px 4px rgba(0, 0, 0, 0.2),
			0px 2px 2px rgba(0, 0, 0, 0.2);
	}

	.memories {
		list-style: none;
		padding: 0;
		margin: var(--space-lg) 0;
		margin-bottom: 12rem;
	}

	.memories li {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.5s ease;
		background-color: var(--clr-light-parchment);
		position: relative;
		z-index: 2;
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
		position: relative;
		z-index: 1;
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

	.washi-tape {
		position: absolute;
		width: 60%;
		height: 40px;
		background-color: #5c2e0e; /* Darker base brown */
		opacity: 0.9; /* Slightly more opaque */
		z-index: 4; /* Ensure tape is above watercolour */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Slightly stronger shadow */
	}

	.washi-tape-top {
		top: -32px;
		left: 20px;
		transform: rotate(-1deg);
	}

	.washi-tape-bottom {
		bottom: -32px;
		right: 20px;
		transform: rotate(1deg);
	}

	.watercolour-stroke {
		position: absolute;
		width: 100%;
		height: 100px;
		background-image: url('$lib/img/watercolour_stroke1.png');
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0.8;
		pointer-events: none;
		z-index: 1;
		mix-blend-mode: multiply;
	}

	.watercolour-stroke-top {
		background-position: left;
		top: -60px;
		left: 20%;
	}

	.watercolour-stroke-bottom {
		bottom: -60px;
		background-position: right;
		right: 20%;
	}

	.washi-tape::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			linear-gradient(45deg, transparent 45%, #8b4513 45%, #8b4513 55%, transparent 55%),
			linear-gradient(-45deg, transparent 45%, #8b4513 45%, #8b4513 55%, transparent 55%);
		background-size: 15px 15px; /* Slightly smaller pattern for more detail */
		opacity: 0.5; /* More visible pattern */
	}

	.washi-tape::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.05) 100%
		);
		pointer-events: none;
		z-index: 0;
	}

	.leaflet {
		height: 100%;
		width: 100%;
		border: 8px solid #fff;
		box-shadow:
			0px 4px 4px rgba(0, 0, 0, 0.2),
			0px 2px 2px rgba(0, 0, 0, 0.2);
	}

	.info-panel {
		position: absolute;
		z-index: 999;
		top: 10px;
		left: 10px;
		bottom: 10px;
		width: 30%;
		background: var(--clr-light-parchment);
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
		font-variant-numeric: tabular-nums;
		color: var(--clr-text);
		min-width: 100px;
		font-weight: 500;
		flex-shrink: 0;
	}

	.memory-item .description {
		font-size: 0.9em;
		margin: 0;
		padding-left: 0;
		margin-top: var(--space-xs);
	}

	.no-memories {
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
			height: fit-content;
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
