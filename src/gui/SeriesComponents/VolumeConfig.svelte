<script>
    import { fetchAddChapter, fetchSeriesTree, fetchDeleteVolume, viewMode } from '../store.js';
    import NoteView from './NoteView.svelte';
    import Modal from '../shared/Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import { IconButton } from 'linkcube-svelte-components';

    let showModal = false;

    function addChapter() {
        fetchAddChapter().then(fetchSeriesTree());
    }

    function removeVolume() {
        fetchDeleteVolume().then(() => {
            fetchSeriesTree();
            viewMode.set("series");
        });
    }
</script>

<style>
    .volume-view-contents {
        justify-content: space-between;
        width: 50%;
        margin-left: 25%;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>


<div class="volume-view-container flex-column">
    <div class="volume-view-contents flex-row">
        <div class="flex-row">
            <IconButton icon="create_new_folder" title="Add Chapter" on:click={addChapter}/>
            <OpenFolder scope="Volume"></OpenFolder>
        </div>
        <div class="delete">
            <IconButton icon="delete_forever" title="Delete Volume" on:click={() => showModal = true}/>
        </div>
    </div>
    <NoteView scope="Volume"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={removeVolume}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}