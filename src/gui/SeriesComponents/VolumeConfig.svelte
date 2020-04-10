<script>
    import { currentSeries, currentVolume, fetchAddChapter, fetchSeriesTree, fetchDeleteVolume, viewMode } from '../store.js';
    import NoteView from './NoteView.svelte';
    import Modal from './Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';

    let showModal = false;

    function addChapter() {
        fetchAddChapter($currentSeries, $currentVolume).then(
            fetchSeriesTree($currentSeries)
        );
    }

    function removeVolume() {
        fetchDeleteVolume($currentSeries, $currentVolume).then(() => {
            fetchSeriesTree($currentSeries);
            viewMode.set("series");
        });
    }
</script>

<style>
    .volume-view-contents {
        justify-content: space-around;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }
</style>


<div class="volume-view-container flex-column">
    <div class="volume-view-contents flex-row">
        <input type="button" value="Add Chapter" on:click={addChapter}>
        <input type="button" value="Delete Volume" on:click={() => showModal = true}>
    </div>
    <OpenFolder scope="Volume"></OpenFolder>
    <NoteView scope="Volume"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeVolume}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}