<script>
    import {
        currentSeries, currentVolume, currentChapter,fetchAddPage,
        fetchSeriesTree, fetchDeleteChapter, viewMode, graphqlBase,
        fetchExportChapter
    } from '../store.js';
    import NoteView from './NoteView.svelte';
    import Modal from '../shared/Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import { IconButton } from 'linkcube-svelte-components';

    let showModal = false;

    function addPage() {
        fetchAddPage().then(fetchSeriesTree());
    }

    function removeChapter() {
        fetchDeleteChapter().then(() => {
            fetchSeriesTree();
            viewMode.set("volume");
        });
    }

    function uploadChapter(e) {
        const baseData = {
            series: $currentSeries,
            volume: `Volume ${$currentVolume}`,
            chapter: `Chapter ${$currentChapter.id}`
        };
        const formData = new FormData();
        Array.from(e.detail).forEach((file) => {
            formData.append("files", file);
        });
        formData.append("chapterData", JSON.stringify(baseData));
        fetch(`${graphqlBase}/uploadChapter`, { method: "POST", body: formData}).then(() => {
            fetchSeriesTree()
        })
    }
</script>

<style>
    .chapter-view-contents {
        justify-content: space-between;
        width: 50%;
        margin-left: 25%;
        margin-bottom: 20px;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>


<div class="chapter-view-container flex-column">
    <div class="chapter-view-contents flex-row">
        <div class="flex-row">
            <IconButton icon="note_add" title="Add Page" on:click={addPage}/>
            <OpenFolder scope="Chapter"></OpenFolder>
            <IconButton icon="archive" title="Export Chapter" on:click={fetchExportChapter}/>
            <FancyFile on:upload={uploadChapter} value="Import Pages" icon={true} directory={true}/>
        </div>
        <div class="delete">
            <IconButton icon="delete_forever" title="Delete Chapter" on:click={() => showModal = true}/>
        </div>
    </div>
    <NoteView scope="Chapter"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeChapter}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}