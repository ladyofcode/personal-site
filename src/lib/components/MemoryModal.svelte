<script lang="ts">
	import { modalStore } from '$lib/stores/modal';
	import ImageSingle from '$lib/components/ImageSingle.svelte';

	function closeMemoryModal() {
		modalStore.set({ selectedMemory: null, clickedElement: null });
		document.body.style.overflow = '';
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeMemoryModal();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeMemoryModal();
		}
	}
</script>

{#if $modalStore.selectedMemory}
	<div class="modal-overlay" onclick={handleOverlayClick} onkeydown={handleKeydown} role="button" tabindex="0">
		<div class={`modal-content stamp-border`}>
            <div class="modal-body">
                <button class="modal-close" onclick={closeMemoryModal}>×</button>
				{#if $modalStore.selectedMemory.featuredImage}
					<div class="featured-image taped-image">
						<ImageSingle 
							galleryID={`memory-modal-${$modalStore.selectedMemory.title}-${new Date($modalStore.selectedMemory.date).getMonth() + 1}`}
							images={[$modalStore.selectedMemory.featuredImage]}
						/>
					</div>
				{/if}
				<div class="memory-header">
					<h2 class="title-wrapper">
						<time datetime={$modalStore.selectedMemory.date}>
							{new Date($modalStore.selectedMemory.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
						</time> - 
						{$modalStore.selectedMemory.title}
					</h2>
				</div>
				<p class="description">{$modalStore.selectedMemory.description}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 1000;
	}

	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: var(--space-xl);
		border-radius: 8px;
		width: min(90%, 800px);
		max-height: calc(100vh - var(--space-md) * 2);
		overflow-y: auto;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
		z-index: 1001;
		position: relative;
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
		position: relative;
	}

	.modal-body .memory-header {
		margin-bottom: var(--space-md);
	}

	.modal-body .description {
		font-size: 1.1em;
		line-height: 1.6;
	}
</style> 