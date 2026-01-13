<script>
	import { onMount } from 'svelte';
    import ChallengeCore from '$lib/components/ChallengeCore.svelte';
	import data from './three.json';
</script>


<ChallengeCore data={data} title="100 Days of Threejs" />

