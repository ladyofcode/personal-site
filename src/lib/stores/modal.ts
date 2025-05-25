import { writable } from 'svelte/store';

interface ImageData {
	thumbnailURL: string;
	largeURL: string;
	width?: number;
	height?: number;
}

interface MemoryWithImage {
	date: string;
	title: string;
	description: string;
	country: string;
	city: string;
	featuredImage?: ImageData;
}

export const modalStore = writable<{
	selectedMemory: MemoryWithImage | null;
	clickedElement: HTMLElement | null;
}>({
	selectedMemory: null,
	clickedElement: null
}); 