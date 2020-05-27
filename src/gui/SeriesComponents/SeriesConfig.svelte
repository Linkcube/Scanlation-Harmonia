<script>
    import {
        currentSeries, currentVolume, currentChapter, currentPage, graphqlBase,
        fetchAddVolume, pageMode, fetchSeriesTree, fetchDeleteSeries
    } from '../store.js';
    import NoteView from './NoteView.svelte';
    import StyleTable from './StyleTable.svelte';
    import LanguageTable from './LanguageTable.svelte';
    import Modal from '../shared/Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import { IconButton } from 'linkcube-svelte-components';

    let showModal = false;

    function addVolume() {
        fetchAddVolume().then(fetchSeriesTree());
    }

    function removeSeries() {
        fetchDeleteSeries().then(() => {
            fetchSeriesTree();
            currentVolume.set(null);
            currentChapter.set({});
            currentPage.set({});
            pageMode.set('series-select');
        });
    }

    function uploadImage(e) {
        const formData = new FormData();
        formData.append("image", e.detail);
        formData.append("series", JSON.stringify($currentSeries));
        fetch(`${graphqlBase}/uploadSeriesImage`, { method: "POST", body: formData})
    }
</script>

<style>
    .series-view-contents {
        justify-content: space-between;
        width: 50%;
        margin-left: 25%;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .tables-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>


<div class="series-view-container flex-column">
    <div class="series-view-contents flex-row">
        <div class="flex-row">
            <IconButton icon="create_new_folder" title="Add Volume" on:click={addVolume}/>
            <OpenFolder scope="Series"></OpenFolder>
            <FancyFile on:upload={uploadImage} icon={true} value="Change Series Cover"/>
        </div>
        <div class="delete">
            <IconButton icon="delete_forever" title="Delete Series" on:click={() => showModal = true}/>
        </div>
    </div>
    <div class="tables-container">
        <StyleTable/>
        <LanguageTable/>
    </div>
    <NoteView scope="Series"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeSeries}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}