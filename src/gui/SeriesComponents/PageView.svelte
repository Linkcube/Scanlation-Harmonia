<script>
    import {
        navOpen, currentPage, graphqlBase, pageData, fetchPageData, fetchAddDialogue,
        pageDialogue, fetchPageDialogue, currentSeries, currentVolume, currentChapter,
        fetchDeletePage, viewMode, fetchSeriesTree, currentDialogue, dialogueBubble
    } from '../store.js';
    import SelectedDialogue from './SelectedDialogue.svelte';
    import TableItem from './TableItem.svelte';
    import NoteView from './NoteView.svelte';
    import DraggableDialogue from './DraggableDialogue.svelte';
    import Modal from './Modal.svelte';
    import OpenFolder from './OpenFolder.svelte';

    let selectedImage = "raw";
    let imageContainer;
    let showDialogue = true;
    let showModal = false;
    let selectedDialogue;

    function selectDialogue(index) {
        if (index !== $currentDialogue) {
            selectedDialogue.save().then(() => {
            dialogueBubble.set(dialogueList[index].bubble);
            fetchPageDialogue($currentSeries, $currentVolume, $currentChapter.id, $currentPage, index);
            });
        }
    }

    function addDialogue() {
        fetchAddDialogue($currentSeries, $currentVolume, $currentChapter.id, $currentPage).then(
            fetchPageData($currentSeries, $currentVolume, $currentChapter.id, $currentPage)
        );
    }

    function deletePage() {
        fetchDeletePage($currentSeries, $currentVolume, $currentChapter.id, $currentPage).then(() => {
            fetchSeriesTree($currentSeries);
            viewMode.set("chapter");
        });
    }

    let dialogueList = [];
    let sourceList = [];

    pageData.subscribe((promise) => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                dialogueList = response.data.page.dialogue;
                sourceList = response.data.page.sources;
            }
        })
    });
</script>

<svelte:window
    on:mousedown={() => {if ($currentDialogue > 0) selectedDialogue.save()}}
/>

<style>
    .page-view-contents {
        justify-content: space-around;
        margin-bottom: 20px;
    }

    .page-image-container {
        height: 770px;
        width: 550px;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        border-style: outset;
        border-width: 3px;
        position: absolute;
    }

    .page-image {
        max-height: 770px;
        max-width: 550px;
    }

    .page-display-container {
        margin-right: 25px;
        margin-left: 25px;
        margin-top: 10px;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .layer-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: auto;
        margin-bottom: auto;
    }

    .page-display-options {
        justify-content: center;
    }

    .undo-flex {
        height: 770px;
        width: 550px;
    }

    .dialogue-boxes {
        margin-left: 25px;
        width: 40%;
    }

    .dialogue-box-selection {
        height: 700px;
        overflow-y: auto;
    }

    select, input {
        height: 37px;
        margin-top: auto;
        margin-bottom: auto;
    }

    .notes {
        justify-content: space-around;
    }

    .dialogue-header {
        justify-content: space-around;
    }
</style>


<div class="page-view-container flex-column">
    <div class="notes flex-row">
        <h2>Page {$currentPage}</h2>
    </div>
    <div class="notes flex-row">
        <OpenFolder scope="Page"></OpenFolder>
        <input type="button" value="Delete Page" on:click={() => showModal = true}>
    </div>
    
    <div class="page-view-contents flex-row">
        <div class="dialogue-boxes">
            <div class="dialogue-header flex-row">
                <h2>Dialogue Selection</h2>
                <input type="button" value="Add" on:click={addDialogue}>
            </div>
            <div class="dialogue-box-selection flex-column">
                {#each dialogueList as dialogue, index}
                    <TableItem 
                        itemType=""
                        id={dialogue.title}
                        on:click={() => selectDialogue(index)}
                    ></TableItem>
                {/each}
            </div>
        </div>
        <div class="page-display-container flex-column">
            <div class="page-display-options flex-row">
                <select bind:value={selectedImage}>
                    <option value="full" disabled={!sourceList.full}>
                        Full
                    </option>
                    <option value="redraw" disabled={!sourceList.redraw}>
                        Redraw
                    </option>
                    <option value="clean" disabled={!sourceList.clean}>
                        Clean
                    </option>
                    <option value="raw" disabled={!sourceList.raw}>
                        Raw
                    </option>
                </select>
                <span class="layer-item">
                    <input type="checkbox" bind:checked={showDialogue}>
                    <div>Show Dialogue</div>
                </span>
            </div>
            <div class="undo-flex">
                <div bind:this={imageContainer} class="page-image-container">
                    <img alt="page-image" class="page-image"
                        src={sourceList[selectedImage] ? `${graphqlBase}/${sourceList[selectedImage]}` : ''}
                    >
                    {#if showDialogue}
                        <!-- {#await $pageData then response}
                            {#each response.data.page.dialogue as dialogue, index}
                                <DraggableDialogue
                                    container={imageContainer}
                                    initialValues={dialogue.bubble}
                                    tooltip={dialogue.title}
                                    on:select={() => selectDialogue(index)}
                                ></DraggableDialogue>
                            {/each}
                        {/await} -->
                        {#each dialogueList as dialogue, index}
                            <DraggableDialogue
                                container={imageContainer}
                                initialValues={dialogue.bubble}
                                tooltip={dialogue.title}
                                on:select={() => selectDialogue(index)}
                            ></DraggableDialogue>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <SelectedDialogue bind:this={selectedDialogue}></SelectedDialogue>
    <NoteView scope="Page"></NoteView>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={deletePage}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}