<script>
	import { onMount } from 'svelte';
	import data from './illustration.json';
	import ChallengeCore from '$lib/components/ChallengeCore.svelte';
</script>

<ChallengeCore data={data} title="100 Days of Illustration" />

