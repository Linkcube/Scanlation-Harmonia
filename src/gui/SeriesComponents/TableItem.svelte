<script>
    import { createEventDispatcher } from 'svelte';
    export let itemType;
    export let id;
    export let title = '';

    const dispatch = createEventDispatcher();

    let style = 'page';
    let prefix = '';
    const margin = 7;

    if (itemType === "series") {
        style = `--margin:${margin}px;font-weight: bold;`;
    } else if (itemType === "volume") {
        style = `--margin:${margin*2}px;font-weight: bold;`;
        prefix = 'Vol.';
    } else if (itemType === "chapter") {
        style = `--margin:${margin*3}px;font-weight: bold;`;
        prefix = 'Ch.';
    } else if (itemType === "page"){
        style = `--margin:${margin*5}px`;
        prefix = 'Page';
    } else {
        style = `--margin:${margin}px;`;
    }
</script>

<style>
    span {
        padding-left: var(--margin);
        transition-duration: 400ms;
        cursor: pointer;
    }

    span:hover {
        background-color: lightgray;
        transition-duration: 400ms;
    }
</style>

<span {style} on:click={() => dispatch('click')}>
    {prefix} {id}
    {#if title}
        {title}
    {/if}
</span>