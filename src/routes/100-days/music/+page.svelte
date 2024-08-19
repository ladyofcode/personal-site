<script>
	import { onMount } from 'svelte';
	import ChallengeCore from '$lib/components/ChallengeCore.svelte';
	import data from './music.json';

</script>

<ChallengeCore data={data} title="100 Days of Music" />
