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

    function inputChapter(e) {
        uploadChapter(e.target.files);
    }

    function uploadChapter(files) {
        const baseData = {
            series: $currentSeries,
            volume: `Volume ${$currentVolume}`,
            chapter: `Chapter ${$currentChapter.id}`
        };
        const formData = new FormData();
        console.log(files);
        Array.from(files).forEach((file) => {
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
    <input type="file" webkitdirectory mozdirectory on:change={inputChapter}/>
    <OpenFolder scope="Chapter"></OpenFolder>
    <NoteView scope="Chapter"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeChapter}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}