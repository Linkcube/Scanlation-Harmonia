<script>
    import { currentSeries, currentVolume, currentChapter, currentPage, fetchAddVolume, pageMode, fetchSeriesTree, fetchDeleteSeries } from '../store.js';
    import NoteView from './NoteView.svelte';
    import StyleTable from './StyleTable.svelte';
    import Modal from '../shared/Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import FancyButton from '../shared/FancyButton.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import IconButton from '../shared/IconButton.svelte';

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

    function uploadImage(e) {
        console.log(e);
        const formData = new FormData();
        formData.append("image", e.detail);
        formData.append("series", JSON.stringify($currentSeries));
        fetch('http://localhost:4000/uploadSeriesImage', { method: "POST", body: formData})
    }
</script>

<style>
    .series-view-contents {
        justify-content: space-evenly;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }
</style>


<div class="series-view-container flex-column">
    <div class="series-view-contents flex-row">
        <FancyButton value="Add Volume" on:click={addVolume}/>
        <OpenFolder scope="Series"></OpenFolder>
        <FancyFile on:upload={uploadImage} icon={true} value="Change Series Cover"/>
        <IconButton icon="delete_forever" title="Delete Series" type="warn" on:click={() => showModal = true}/>
    </div>
    <StyleTable></StyleTable>
    <NoteView scope="Series"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeSeries}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}