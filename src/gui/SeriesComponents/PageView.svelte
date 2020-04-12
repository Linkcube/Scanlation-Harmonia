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
    let files;
    let lastTimestamp = Date.now();

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

    function inputImage(e) {
        uploadImage(e.target.files[0]);
    }

    function dropImage(e) {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        const fs = dt.files;
        uploadImage(fs[0]);
    }

    function uploadImage(image) {
        lastTimestamp = Date.now();
        const baseData = {
            series: $currentSeries,
            volume: `Volume ${$currentVolume}`,
            chapter: `Chapter ${$currentChapter.id}`,
            page: `Page ${$currentPage}`,
            image: selectedImage
        };
        const formData = new FormData();
        formData.append("image", image);
        formData.append("pageData", JSON.stringify(baseData));
        fetch('http://localhost:4000/uploadPageImage', { method: "POST", body: formData}).then(() => {
            fetchPageData($currentSeries, $currentVolume, $currentChapter.id, $currentPage);
        })
    }

    function dragHandle(e) {
        e.stopPropagation();
        e.preventDefault();
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
    on:mousedown={() => {if ($currentDialogue >= 0) selectedDialogue.save()}}
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

    .input {
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
        <input type="button" value="Delete Page" class="input" on:click={() => showModal = true}>
    </div>
    
    <div class="page-view-contents flex-row">
        <div class="dialogue-boxes">
            <div class="dialogue-header flex-row">
                <h2>Dialogue Selection</h2>
                <input type="button" value="Add" class="input" on:click={addDialogue}>
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
                <select bind:value={selectedImage} class="input">
                    <option value="full">
                        Full
                    </option>
                    <option value="redraw">
                        Redraw
                    </option>
                    <option value="clean">
                        Clean
                    </option>
                    <option value="raw">
                        Raw
                    </option>
                </select>
                <span class="layer-item">
                    <input type="checkbox" class="input" bind:checked={showDialogue}>
                    <div>Show Dialogue</div>
                </span>
                <input
                    type="file"
                    name="image"
                    class="input"
                    bind:files
                    on:input={inputImage}
                    on:dragenter={dragHandle}
                    on:dragover={dragHandle}
                    on:drop={dropImage}
                >
            </div>
            <div class="undo-flex">
                <div bind:this={imageContainer} class="page-image-container">
                    {#if sourceList[selectedImage]}
                        <img alt="no-page-image" class="page-image"
                            src={`${graphqlBase}/${sourceList[selectedImage]}?timestamp=${lastTimestamp}`}
                        >
                    {:else}
                        <h2>No image found, please upload one.</h2>
                    {/if}
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
                                {index}
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