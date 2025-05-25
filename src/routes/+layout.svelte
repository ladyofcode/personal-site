<script lang="ts">
	import { Nav, Footer } from '$lib';
	import '../app.css';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { DrawSVGPlugin } from 'gsap/dist/DrawSVGPlugin';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { SplitText } from 'gsap/dist/SplitText';
	import { modalStore } from '$lib/stores/modal';
	import ImageSingle from '$lib/components/ImageSingle.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	function closeMemoryModal() {
		modalStore.set({ selectedMemory: null, clickedElement: null });
		document.body.style.overflow = '';
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeMemoryModal();
		}
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrollSmoother, SplitText);
		ScrollSmoother.create({
			smooth: 1,
			effects: true,
			smoothTouch: 0.1
		});
	});
</script>

<Nav />

<div id="smooth-wrapper">
	<div id="smooth-content">
		{@render children?.()}
		<Footer />
	</div>
</div>

{#if $modalStore.selectedMemory}
	<div class="modal-overlay" onclick={handleOverlayClick}>
		<div class="modal-content">
			<button class="modal-close" onclick={closeMemoryModal}>×</button>
			<div class="modal-body">
				{#if $modalStore.selectedMemory.featuredImage}
					<div class="featured-image">
						<ImageSingle 
							galleryID={`memory-modal-${$modalStore.selectedMemory.date}`}
							images={[$modalStore.selectedMemory.featuredImage]}
						/>
					</div>
				{/if}
				<div class="memory-header">
					<div class="title-wrapper">
						<time datetime={$modalStore.selectedMemory.date}>
							{new Date($modalStore.selectedMemory.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
						</time> - 
						{$modalStore.selectedMemory.title}
					</div>
				</div>
				<p class="description">{$modalStore.selectedMemory.description}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	#smooth-content {
		padding-top: var(--height-main-menu);
		width: 100%;
		max-width: var(--site-width);
		background: url('/images/desk_bg.jpg') repeat;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--clr-paper-light);
		padding: var(--space-xl);
		border-radius: 8px;
		width: min(90%, 800px);
		max-height: calc(100vh - var(--space-md) * 2);
		overflow-y: auto;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1001;
	}

	.modal-close {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
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
		color: var(--clr-text-muted);
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.modal-close:hover {
		background: var(--clr-paper-dark);
		color: var(--clr-text);
	}

	.modal-body {
		margin-top: var(--space-md);
	}

	.modal-body .featured-image {
		margin-bottom: var(--space-lg);
	}

	.modal-body .featured-image img {
		width: 100%;
		height: 400px;
		object-fit: cover;
		border-radius: 4px;
	}

	.modal-body .memory-header {
		margin-bottom: var(--space-md);
	}

	.modal-body .description {
		font-size: 1.1em;
		line-height: 1.6;
	}
</style>
