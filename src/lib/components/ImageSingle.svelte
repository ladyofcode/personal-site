<script>
	export let galleryID;
	export let images;
	export let removeTopMargin = false;
	export let scroller = false;
	export let shadow = false;

	import { onMount } from 'svelte';
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
	import 'photoswipe/style.css';
	import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

	let item = [];

	onMount(() => {
		const options = {
			gallery: '#' + galleryID,
			children: item,
			pswpModule: () => import('photoswipe')
		};
		const lightbox = new PhotoSwipeLightbox(options);

		const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
			type: 'auto'
		});

		lightbox.init();
	});
</script>

<div
	class="pswp-gallery pswp-gallery--single-column"
	class:top-margin-remove={removeTopMargin || scroller}
	id={galleryID}
>
	<figure class="pswp-gallery__item" bind:this={item[0]} class:scroller class:shadow>
		<a
			href={images[0].largeURL}
			data-pswp-width={images[0].width}
			data-pswp-height={images[0].height}
			target="_blank"
			rel="noreferrer"
		>
			<img src={images[0].thumbnailURL} alt="" class:scroller />
		</a>
	</figure>
</div>

<style>
	div {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	figure.shadow {
		background: var(--clr-bg-main);
		box-shadow: var(--box-shadow);
		border-radius: var(--radius-corner);
		padding: var(--space-md);
	}
	div.top-margin-remove {
		margin-top: 0;
	}
	figure {
		display: inline-block;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0 auto;
		border-radius: var(--radius-corner);
	}
	figure.scroller {
		max-width: 100%;
		margin: auto;
		height: 100%;
	}
	a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		max-height: calc(var(--height-viewable) - 20vh);
		border-radius: var(--radius-corner);
	}
	img {
		height: auto;
		width: 100%;
		object-fit: contain;
		border-radius: var(--radius-corner);
	}
	img.scroller {
		max-width: 100%;
		max-height: 34vw;
		height: auto;
	}
	img.scroller {
		object-position: center;
	}

	.top-margin-remove {
		margin-top: 0;
		margin-bottom: 0;
	}

	@media (min-width: 600px) {
		div {
			width: auto;
		}
		figure {
			width: auto;
		}
		img {
			width: 100%;
			height: 100%;
			max-height: calc(var(--height-viewable) - 20vh);
		}
	}

	@media (min-width: 900px) {
		div {
			padding: var(--space-lg);
		}
	}
</style>
