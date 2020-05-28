<script>
    import { createEventDispatcher } from 'svelte';
    import { 
        IconButton,
        MaterialButton
    } from 'linkcube-svelte-components';

    export let value;
    export let directory = false;
    export let icon = false;

    const dispatch = createEventDispatcher();
    const upload = (data) => dispatch('upload', data);

    let files;

    export function click() {
        files.click();
    }

    function inputImage(e) {
        if (directory) {
            upload(e.target.files);
        } else {
            upload(e.target.files[0]);
        }
    }

    function dropImage(e) {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        const fs = dt.files;
        if (directory) {
            upload(fs);
        } else {
            upload(fs[0]);
        }
    }

    function dragHandle(e) {
        e.stopPropagation();
        e.preventDefault();
    }
</script>

{#if directory}
    <input
        type="file"
        bind:this={files}
        on:input={inputImage}
        hidden
        webkitdirectory
        mozdirectory
    >
{:else}
    <input
        type="file"
        bind:this={files}
        on:input={inputImage}
        hidden
    >
{/if}

{#if icon}
    <IconButton
        icon={directory ? "collections" : "insert_photo"}
        on:click={() => files.click()}
        on:dragenter={dragHandle}
        on:dragover={dragHandle}
        on:drop={dropImage}
        title={value}
    />
{:else}
    <MaterialButton
        on:click={() => files.click()}
        on:dragenter={dragHandle}
        on:dragover={dragHandle}
        on:drop={dropImage}
        {value}
    />
{/if}

