<script lang="ts">
	import { Nav, Footer } from '$lib';
	import '../app.css';

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { DrawSVGPlugin } from 'gsap/dist/DrawSVGPlugin';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { SplitText } from 'gsap/dist/SplitText';

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
		<slot />
		<Footer />
	</div>
</div>

<style>
	#smooth-content {
		padding-top: var(--height-main-menu);
		width: 100%;
		max-width: var(--site-width);
		background: url('/images/desk_bg.jpg') repeat;
	}
</style>
