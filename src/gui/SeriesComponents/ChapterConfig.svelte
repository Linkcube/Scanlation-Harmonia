<script>
    import { currentSeries, currentVolume, currentChapter, fetchAddPage, fetchSeriesTree, fetchDeleteChapter, viewMode } from '../store.js';
    import NoteView from './NoteView.svelte';
    import Modal from './Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';

    let showModal = false;

    function addPage() {
        fetchAddPage($currentSeries, $currentVolume, $currentChapter.id).then(
            fetchSeriesTree($currentSeries)
        );
    }

    function removeChapter() {
        fetchDeleteChapter($currentSeries, $currentVolume, $currentChapter.id).then(() => {
            fetchSeriesTree($currentSeries);
            viewMode.set("volume");
        });
    }
</script>

<style>
    .chapter-view-contents {
        justify-content: space-around;
        margin-bottom: 20px;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }
</style>


<div class="chapter-view-container flex-column">
    <div class="chapter-view-contents flex-row">
        <input type="button" value="Add Page" on:click={addPage}>
        <input type="button" value="Delete Chapter" on:click={() => showModal = true}>
    </div>
    <OpenFolder scope="Chapter"></OpenFolder>
    <NoteView scope="Chapter"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeChapter}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}