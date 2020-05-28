<script>
    import {
        navOpen, currentPage, graphqlBase, pageData, fetchPageData, fetchAddDialogue,
        pageDialogue, fetchPageDialogue, currentSeries, currentVolume, currentChapter,
        fetchDeletePage, viewMode, fetchSeriesTree, currentDialogue, dialogueBubble, seriesTree
    } from '../store.js';
    import SelectedDialogue from './SelectedDialogue.svelte';
    import NoteView from './NoteView.svelte';
    import DraggableDialogue from './DraggableDialogue.svelte';
    import Modal from '../shared/Modal.svelte';
    import ImageModal from '../shared/ImageModal.svelte';
    import OpenFolder from './OpenFolder.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import {
        IconButton,
        MaterialButton,
        MaterialInput,
        MaterialSelect,
        MaterialTable,
        MaterialTableRow,
        PreviewCard
    } from 'linkcube-svelte-components';

    let selectedImage = "raw";
    let imageContainer;
    let upload;
    let showDialogue = true;
    let showModal = false;
    let showImageModal = false;
    let selectedDialogue;
    let files;
    let lastTimestamp = Date.now();
    let pageWidth = 550;
    let pages = [];

    function selectDialogue(index) {
        if (index !== $currentDialogue) {
            selectedDialogue.save().then(() => {
                dialogueBubble.set(dialogueList[index].bubble);
                fetchPageDialogue(index);
            });
        }
    }

    function addDialogue() {
        fetchAddDialogue().then(fetchPageData());
    }

    function deletePage() {
        fetchDeletePage().then(() => {
            fetchSeriesTree();
            viewMode.set("chapter");
        });
    }

    function uploadImage(e) {
        lastTimestamp = Date.now();
        const baseData = {
            series: $currentSeries,
            volume: `Volume ${$currentVolume}`,
            chapter: `Chapter ${$currentChapter.id}`,
            page: `Page ${$currentPage}`,
            image: selectedImage
        };
        const formData = new FormData();
        formData.append("image", e.detail);
        formData.append("pageData", JSON.stringify(baseData));
        fetch(`${graphqlBase}/uploadPageImage`, { method: "POST", body: formData}).then(() => {
            fetchPageData();
        })
    }

    function selectPage() {
        $currentDialogue = -1;
        fetchPageData();
    }

    function previousPage() {
        if ($currentPage > pages[0].id) {
            let index = pages.findIndex((page) => page.id === $currentPage);
            $currentDialogue = -1;
            currentPage.set(pages[index - 1].id);
            fetchPageData();
        }
    }

    function nextPage() {
        if ($currentPage < (pages[pages.length - 1].id)) {
            let index = pages.findIndex((page) => page.id === $currentPage);
            $currentDialogue = -1;
            currentPage.set(pages[index + 1].id);
            fetchPageData();
        }
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

    currentPage.subscribe(() => {
        dialogueList = [];
    });

    function dragHandle(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function dropImage(e) {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        const fs = dt.files;
        uploadImage({detail: fs[0]});
    }

    function openImage() {
        window.open(`${graphqlBase}/${sourceList[selectedImage]}?timestamp=${lastTimestamp}`);
    }

    function handleKey(event) {
        if (event.altKey && event.ctrlKey) {
            if (event.code === "KeyA") {
                event.preventDefault();
                selectedDialogue.save();
                addDialogue();
            } else if (event.code === "KeyS") {
                event.preventDefault();
                showDialogue = !showDialogue
            } else if (event.code === "KeyD") {
                event.preventDefault();
                upload.click();
            } else if (event.code === "KeyF") {
                event.preventDefault();
                showImageModal = !showImageModal;
            } else if (event.code === "KeyG") {
                event.preventDefault();
                openImage();
            } else if (event.code === "ArrowLeft") {
                event.preventDefault();
                previousPage();
            } else if (event.code === "ArrowRight") {
                event.preventDefault();
                nextPage();
            }
        }
    }

    seriesTree.subscribe((promise) => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                pages = response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages;
            }
        })
    });
</script>

<svelte:window
    on:mousedown={() => {if ($currentDialogue >= 0) selectedDialogue.save()}}
    on:keyup={handleKey}
/>

<style>
    .modal-image {
        cursor: zoom-out;
        align-self: self-start;
    }

    .page-view-contents {
        justify-content: space-around;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .page-image-container {
        height: var(--height);
        width: var(--width);
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        border-style: outset;
        border-width: 3px;
        position: absolute;
    }

    .page-image {
        max-height: var(--height);
        max-width: var(--width);
        cursor: zoom-in;
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

    .page-display-options {
        justify-content: space-between;
    }

    .undo-flex {
        height: var(--height);
        width: var(--width);
        margin-bottom: 20px;
    }

    .dialogue-boxes {
        width: 35%;
        min-width: 250px;
        max-width: 600px;
    }

    .page-view-header {
        justify-content: space-between;
        width: 50%;
        margin-left: 25%;
    }

    .dialogue-header {
        justify-content: space-between;
    }

    h2 {
        margin-right: 10px;
    }

    .nav-button {
        margin: auto;
        margin-left: 8px;
        margin-right: 8px;
        font-size: x-large;
        color: black;
    }

    .nav-button:disabled {
        cursor: none;
    }

    .dialogue-selection-title {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        font-size: large;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }

    .page-number {
        justify-content: space-around;
        width: 100px;
    }
</style>


<div class="page-view-container flex-column">
    <div class="page-view-header flex-row">
        <OpenFolder scope="Page"></OpenFolder>
        <div class="flex-row">
            {#await $seriesTree then response}
                {#if $currentPage > pages[0].id}
                    <a class="nav-button" href="#previous-page" on:click={previousPage}>{"<"}</a>
                {:else}
                    <a class="nav-button" href="#no-previous-page" disabled>{"<"}</a> 
                {/if}
                <div class="flex-row page-number">
                    <p>Page</p>
                    <MaterialSelect bind:value={$currentPage} on:change={selectPage}>
                        {#each pages as page, index}
                            <option value={page.id}>{page.id}</option>
                        {/each}
                    </MaterialSelect>
                </div>
                {#if $currentPage < (pages[pages.length - 1].id)}
                    <a class="nav-button" href="#next-page" on:click={nextPage}>{">"}</a>
                {:else}
                    <a class="nav-button" href="#no-next-page" disabled>{">"}</a>
                {/if}
            {/await}
        </div>
        <div class="delete">
            <IconButton icon="delete_forever" title="Delete Page" on:click={() => showModal = true}/>
        </div>
    </div>
    <div class="page-view-contents flex-row">
        <div class="dialogue-boxes">
            <div class="dialogue-header flex-row">
                <span class="dialogue-selection-title">Dialogue Selection</span>
            </div>
            <MaterialTable items={dialogueList} columnSizes={["10%", "90%"]} height="250px">
                <div class="row" slot="item" let:item let:index>
                    <MaterialTableRow
                        type="click row"
                        values={[`${index + 1}.`, item.title]}
                        on:click={() => selectDialogue(index)}
                    />
                </div>
            </MaterialTable>
            <SelectedDialogue bind:this={selectedDialogue}></SelectedDialogue>
        </div>
        <div class="page-display-container flex-column">
            <div class="page-display-options flex-row">
                <MaterialSelect bind:value={selectedImage} label="Image">
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
                </MaterialSelect>
                <div class="flex-row">
                    <IconButton icon="add_comment" title="Add Dialogue (Alt+Ctrl+A)" on:click={addDialogue} scaleX={-1}/>
                    <IconButton
                        title={showDialogue ? "Hide Dialogue (Alt+Ctrl+S)" : "Show Dialogue (Alt+Ctrl+S)"}
                        on:click={() => showDialogue = !showDialogue}
                        icon={showDialogue ? "speaker_notes" : "speaker_notes_off"}
                    />
                    <FancyFile bind:this={upload} on:upload={uploadImage} icon={true} value="Change Image (Alt+Ctrl+D)"/>
                    <IconButton
                        title="Expand Page Image (Alt+Ctrl+F)"
                        on:click={() => showImageModal = !showImageModal}
                        icon="aspect_ratio"
                    />
                    <IconButton
                        title="Open in a New Tab (Alt+Ctrl+G)"
                        icon="launch"
                        on:click={openImage}
                    />
                </div>
            </div>
            <div class="undo-flex" style="--width: {pageWidth}px; --height: {pageWidth * 1.4}px;">
                <div
                    bind:this={imageContainer}
                    class="page-image-container"
                    style="--width: {pageWidth}px; --height: {pageWidth * 1.4}px;"
                    on:dragenter={dragHandle}
                    on:dragover={dragHandle}
                    on:drop={dropImage}
                    on:click={() => showImageModal = !showImageModal}
                >
                    {#if sourceList[selectedImage]}
                        <img alt="page-image" class="page-image" style="--width: {pageWidth}px; --height: {pageWidth * 1.4}px;"
                            src={`${graphqlBase}/${sourceList[selectedImage]}?timestamp=${lastTimestamp}`}
                        >
                    {:else}
                        <h2>No image found, please upload one using the icon above.</h2>
                    {/if}
                    {#if showDialogue}
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
        <NoteView scope="Page"></NoteView>
    </div>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={deletePage}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}

{#if showImageModal}
    <ImageModal on:close={() => showImageModal = false}>
        <img
            on:click={() => showImageModal = !showImageModal}
            alt="no-page-image"
            class="modal-image"
            src={`${graphqlBase}/${sourceList[selectedImage]}?timestamp=${lastTimestamp}`}
        >
    </ImageModal>
{/if}