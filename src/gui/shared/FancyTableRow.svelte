<script>
    import { getContext } from 'svelte';
    import IconButton from './IconButton.svelte';

    export let values = [];
    export let type = 'row';
    export let depth = 0;

    const sizes = getContext('sizes');
    const parent = getContext('uuid');
    const expand = type.includes('expand');
    let expanded = true;

    function toggle(e) {
        e.preventDefault();
        e.stopPropagation();
        expanded = !expanded;
    }
</script>

<style>
    div {
        width: 100%;
        display: flex;
        flex-direction: row;
        line-height: 48px;
    }

    .row {
        transition-duration: 400ms;
        border-top: 1px solid gray;
        
    }

    .click {
        cursor: pointer;
    }

    .click:hover {
        background: rgb(235, 246, 250);
        transition-duration: 400ms;
    }

    .content {
        width: var(--width);
        justify-content: flex-start;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>

<div class={type} on:click>
    <span class="content" style={`--width: ${depth * 15}px`}/>
    {#if expand}
        <span class="content" style="--width:60px">
            <IconButton
                icon={expanded ? "expand_more" : "chevron_right"}
                title={expanded ? "Hide Children" : "Show Children"}
                on:click={toggle}
            />
        </span>
    {/if}
    {#each values as value, index}
        <span class="content" style="--width: {sizes[index]}" title={value}>{value}</span>
    {/each}
</div>
{#if expanded}
    <slot name="children"></slot>
{/if}