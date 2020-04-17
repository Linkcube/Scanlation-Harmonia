<script>
    import { currentSeries, currentVolume, currentChapter, fetchAddPage, fetchSeriesTree, fetchDeleteChapter, viewMode } from '../store.js';
    import NoteView from './NoteView.svelte';
    import Modal from '../shared/Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import FancyButton from '../shared/FancyButton.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import IconButton from '../shared/IconButton.svelte';

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
        fetch('http://localhost:4000/uploadChapter', { method: "POST", body: formData}).then(() => {
            fetchSeriesTree($currentSeries)
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
</style>


<div class="chapter-view-container flex-column">
    <div class="chapter-view-contents flex-row">
        <div class="flex-row">
            <IconButton icon="note_add" title="Add Page" on:click={addPage}/>
            <OpenFolder scope="Chapter"></OpenFolder>
            <FancyFile on:upload={uploadChapter} value="Import Pages" icon={true} directory={true}/>
        </div>
        <IconButton icon="delete_forever" title="Delete Chapter" type="warn" on:click={() => showModal = true}/>
    </div>
    <NoteView scope="Chapter"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeChapter}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}