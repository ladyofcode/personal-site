<script lang="ts">
	import { browser } from '$app/environment';
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

	import { Memory } from '$lib';

	let mapElement: any = $state();
	let map: any;
	let worldLayer: any;
	let customIcon: any;
	let L: any; // Declare L as a module-level variable

	const pins = [pin1, pin2, pin3, pin4, pin5, pin6];

	function getRandomPin() {
		const randomIndex = Math.floor(Math.random() * pins.length);
		return pins[randomIndex];
	}

	function getColor(state: boolean) {
		return state ? '#ffffff' : '#000000';
	}

	function style(feature: any) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.6,
			fillColor: getColor(feature.properties.visited)
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

	function onEachFeature(feature: any, layer: any) {
		if (feature.properties.visited === true) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
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
				click: () => zoomToFeature({ target: layer })
			});
		}
	}

	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');
			L = leaflet; // Assign the imported leaflet module to our L variable

			map = leaflet
				.map(mapElement, {
					scrollWheelZoom: false
				})
				.setView([51, -0], 2);

			leaflet
				.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
					attribution:
						'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
					minZoom: 1,
					maxZoom: 16
					// noWrap: true
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

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<main class="container">
	<section>
		<h1>Log</h1>
		<div class="leaflet" bind:this={mapElement}></div>
	</section>

	<section class="content">
		<h2>Memories</h2>

		<p>All you're getting for now is a list of the countries I've visited.</p>
		
		<p>I'll be updating this section plenty, soon...</p>
		
		<p>... But not too soon. I've got to find some acceptable country boundaries because in this map BAHRAIN and some other countries are MISSING. Inconceivable!</p>

		<p>Memories to add: Australia, Bahrain, Canada, Cambodia, Egypt, Fiji, France, Guam, Hong Kong, Jordan, India, Indonesia, Malaysia, Maldives, Mauritius, Netherlands, Oman, Saudi, Singapore, South Africa, Sri Lanka, Tanzania, Thailand, Turkey, UAE, USA (CA, FL, HI), UK (England, Scotland), Zambia</p>
		
		<ul class="memories">
			{#each data.memories as { title, date }}
				<li>
					<time datetime={date}>{new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</time>
					<span class="title">{title}</span>
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

	h1 {
		font-size: 6rem;
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
		align-items: baseline;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
		font-family: "Domine", serif;
		padding: var(--space-xs) var(--space-sm);
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.memories li:hover {
		background-color: var(--clr-paper-dark);
	}

	.memories time {
		font-variant-numeric: tabular-nums;
		color: var(--clr-text-muted);
		min-width: 100px;
	}

	.memories .title {
		font-weight: 500;
	}
</style>
