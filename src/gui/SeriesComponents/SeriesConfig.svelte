<script>
    import { currentSeries, currentVolume, currentChapter, currentPage, fetchAddVolume, pageMode, fetchSeriesTree, fetchDeleteSeries } from '../store.js';
    import NoteView from './NoteView.svelte';
    import StyleTable from './StyleTable.svelte';
    import Modal from './Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';

    let showModal = false;

    function addVolume() {
        fetchAddVolume($currentSeries).then(
            fetchSeriesTree($currentSeries)
        );
    }

    function removeSeries() {
        fetchDeleteSeries($currentSeries).then(() => {
            fetchSeriesTree($currentSeries);
            currentVolume.set(null);
            currentChapter.set({});
            currentPage.set({});
            pageMode.set('series-select');
        });
    }
</script>

<style>
    .series-view-contents {
        justify-content: space-around;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .user-inputs {
        justify-content: center;
    }

    textarea.regex-rules {
        height: 200px;
        min-width: 350px;
        resize: none;
    }
</style>


<div class="series-view-container flex-column">
    <div class="series-view-contents flex-row">
        <input type="button" value="Add Volume" on:click={addVolume}>
        <input type="button" value="Delete Series" on:click={() => showModal = true}>
    </div>
    <OpenFolder scope="Series"></OpenFolder>
    <StyleTable></StyleTable>
    <NoteView scope="Series"></NoteView>
    <!-- <div class="series-view-contents flex-row">
        <h2>Regex Rules</h2>
    </div>
    <div class="user-inputs flex-row">
        <textarea class="regex-rules" placeholder="Raw Text Rules"></textarea>
        <textarea class="regex-rules" placeholder="Translated Text Rules"></textarea>
    </div> -->
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeSeries}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}