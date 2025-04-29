<script lang="ts">
    let { title, date } = $props();
</script>

<li>
    <h3>
        {title}
    </h3>
    <p>{date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
</li>

<style>
    li {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 800px) {
        li {
            flex-direction: row;
        }
    }
</style>