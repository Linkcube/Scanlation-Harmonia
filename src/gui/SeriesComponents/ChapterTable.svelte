<script>
    import { createEventDispatcher } from 'svelte';
    export let data;
    export let height = "100%";

    const dispatch = createEventDispatcher();
</script>

<style>
    table {
        display: flex;
        flex-direction: column;
        border-collapse: collapse;
    }

    th, td {
        padding: 5px;
        text-align: left;
    }

    tr {
        display: inline-block;
        width: 100%;
        cursor: pointer;
    }

    tr:hover {
        background-color: lightgray;
        transition-duration: 400ms;
    }
</style>

<!-- Replace this with spans, get functionality like the preview-card -->
<table>
    <tr on:click={() => dispatch('selected', { series: 'seriesId' })}>
        <th>Series</th>
    </tr>
    <div class="scrolling-content" style="--height:{height}">
        {#each data as volume }
            <tr on:click={dispatch('selected', { vol: volume.volume })}>
                <th>Vol. {volume.volume}</th>
            </tr>
            {#each volume.chapters as chapter}
            <tr on:click={dispatch('selected', { vol: volume.volume, ch: chapter.chapter, title: chapter.title})}>
                <td>Ch. {chapter.chapter}:</td>
                <td>{chapter.title}</td>
            </tr>
            {/each}
        {/each}
    </div>
</table>
