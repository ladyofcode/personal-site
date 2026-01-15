<script lang="ts">

    import { onMount } from "svelte";
    import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import ImageSingle from '$lib/components/ImageSingle.svelte';
	let { data, title } = $props();
	
	
	let boxes = $state<HTMLDivElement[]>([]);
	
	const images = import.meta.glob<{ default: string }>('../../routes/(app)/100-days/japanese/img/*.{jpg,jpeg,png,webp}', {
		eager: true
	});

	function getImageData(media: string | { path: string; width: number; height: number }) {
		const imagePath = typeof media === 'string' ? media : media.path;
		const imageKey = `../../routes/(app)/100-days/japanese/img/${imagePath}`;
		const image = images[imageKey];

		if (!image) {
			console.error(`Image not found: ${imageKey}`);
			return null;
		}

		const metadata = typeof media === 'string' ? { width: undefined, height: undefined } : {
			width: media.width,
			height: media.height
		};

		return {
			thumbnailURL: image.default,
			largeURL: image.default,
			...metadata
		};
	}

	function isLocalImage(media: string | false | { path: string; width: number; height: number }): boolean {
		if (!media) return false;
		if (typeof media === 'string') return !media.startsWith('http');
		return true; // If it's an object with path, it's a local image
	}
	
    onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		// Apply ScrollTrigger animations for each div
		boxes.forEach((div) => {
			gsap.from(div, {
				opacity: 0,
				duration: 1,
				y: 10,
				scrollTrigger: {
					trigger: div,
					start: 'top 80%',
					end: 'top 60%',
					scrub: true,
					toggleActions: 'play none none reverse'
				}
			});
		});
	});
</script>

<main class="desk">
	<section class="container odc-days">
		<div class="title-paper">
			<h1>{title}</h1>
		</div>

		{#each data as item, index}
			<div
				bind:this={boxes[index]}
				class={`card ${
					index % 4 === 0 ? 'left' : index % 4 === 1 || index % 4 === 3 ? 'center' : 'right'
				}`}
			>
				<p>Day {index === 69 ? index + ' nice' : index}</p>
				<p>{@html item.full_text.replace(/\n/g, '<br />')}</p>
				{#if item.media}
					{#if isLocalImage(item.media)}
						{#if getImageData(item.media)}
							<div class="media-container">
								<ImageSingle 
									galleryID={`challenge-${index}`}
									images={[getImageData(item.media)]}
									shadow={true}
								/>
							</div>
						{/if}
					{:else}
						<div class="media-container">
							<img src={item.media} alt="" class="media-image" />
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</section>
</main>

<style>
	.title-paper {
		background-color: var(--clr-paper-light);
		margin-bottom: var(--space-xxxxl);
	}

	.desk {
		height: 100%;
		background: url('/images/desk_bg.jpg') repeat;
	}

	.odc-days .card {
		width: 60%;
		height: 100%;
		max-width: 400px;
		padding: 1rem;
		background: var(--clr-paper-light);
		transition: all 0.3s ease;
		filter: drop-shadow(-6px 6px 6px rgba(0, 0, 0, 0.1))
			drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.4));
	}

	.odc-days .card > p:first-of-type {
		background-color: var(--clr-charcoal-paper);
		color: #fff;
		font-family: 'Special Elite', system-ui;
		padding: 0.8rem 2rem;
		font-size: 1.4rem;
		box-shadow: -3px 3px 2px 2px rgba(0, 0, 0, 0.4), -2px 2px 1px 1px rgba(0, 0, 0, 0.8);
	}

	.odc-days .card > p:last-of-type {
		font-family: 'Domine', serif;
		padding: 0.8rem 1.6rem;
	}

	.odc-days .left {
		margin-left: 0;
	}

	.odc-days .center {
		margin-left: 35%;
	}

	.odc-days .right {
		margin-left: auto;
	}

	@media (min-width: 800px) {
		.odc-days > .card {
			width: 30%;
		}

		.odc-days .left {
			margin-left: 0;
		}

		.odc-days .center {
			margin-left: 35%;
		}

		.odc-days .right {
			margin-left: auto;
		}
	}

	.media-container {
		margin-top: var(--space-md);
		width: 100%;
	}

	.media-image {
		width: 100%;
		height: auto;
		border-radius: var(--radius-sm);
		box-shadow: var(--box-shadow);
	}
</style>
