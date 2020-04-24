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
    import FancyButton from '../shared/FancyButton.svelte';
    import FancySelect from '../shared/FancySelect.svelte';
    import FancyFile from '../shared/FancyFile.svelte';
    import IconButton from '../shared/IconButton.svelte';
    import FancyTable from '../shared/FancyTable.svelte';
    import FancyTableRow from '../shared/FancyTableRow.svelte';

    let selectedImage = "raw";
    let imageContainer;
    let showDialogue = true;
    let showModal = false;
    let showImageModal = false;
    let selectedDialogue;
    let files;
    let lastTimestamp = Date.now();
    let selectedPage = $currentPage;
    let pageWidth = 550;

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

    function previousPage(pages) {
        let index = pages.findIndex((page) => page.id === $currentPage);
        $currentDialogue = -1;
        currentPage.set(pages[index - 1].id);
        fetchPageData();
    }

    function nextPage(pages) {
        let index = pages.findIndex((page) => page.id === $currentPage);
        $currentDialogue = -1;
        currentPage.set(pages[index + 1].id);
        fetchPageData();
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
</script>

<svelte:window
    on:mousedown={() => {if ($currentDialogue >= 0) selectedDialogue.save()}}
/>

<style>
    .modal-image {
        cursor: zoom-out;
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
        justify-content: flex-start;
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
</style>


<div class="page-view-container flex-column">
    <div class="page-view-header flex-row">
        <OpenFolder scope="Page"></OpenFolder>
        <div class="flex-row">
            {#await $seriesTree then response}
                {#if 
                    $currentPage > response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages[0].id
                }
                    <a class="nav-button" href="#previous-page" on:click={() => previousPage(response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages)}>{"<"}</a>
                {:else}
                    <a class="nav-button" href="#no-previous-page" disabled>{"<"}</a> 
                {/if}
                <div class="flex-row">
                    <p>Page</p>
                    <FancySelect bind:value={$currentPage} on:change={selectPage}>
                        {#each response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages as page, index}
                            <option value={page.id}>{page.id}</option>
                        {/each}
                    </FancySelect>
                </div>
                {#if 
                    $currentPage < (
                        response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages[
                            response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages.length - 1
                        ].id
                    )
                }
                    <a class="nav-button" href="#next-page" on:click={() => nextPage(response.data.seriesTree[$currentVolume - 1].chapters[$currentChapter.id - 1].pages)}>{">"}</a>
                {:else}
                    <a class="nav-button" href="#no-next-page" disabled>{">"}</a>
                {/if}
            {/await}
        </div>
        <IconButton icon="delete_forever" title="Delete Page" type="warn" on:click={() => showModal = true}/>
    </div>
    <div class="page-view-contents flex-row">
        <div class="dialogue-boxes">
            <div class="dialogue-header flex-row">
                <span class="dialogue-selection-title">Dialogue Selection</span>
                <IconButton icon="add_box" title="Add Dialogue" on:click={addDialogue}/>
            </div>
            <FancyTable items={dialogueList} columnSizes={["10%", "90%"]} height="250px">
                <div class="row" slot="item" let:item let:index>
                    <FancyTableRow
                        type="click row"
                        values={[`${index + 1}.`, item.title]}
                        on:click={() => selectDialogue(index)}
                    />
                </div>
            </FancyTable>
            <SelectedDialogue bind:this={selectedDialogue}></SelectedDialogue>
        </div>
        <div class="page-display-container flex-column">
            <div class="page-display-options flex-row">
                <FancySelect bind:value={selectedImage} label="Image">
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
                </FancySelect>
                <div class="flex-row">
                    <FancyFile on:upload={uploadImage} icon={true} value="Change Image"/>
                    <IconButton
                        title={showDialogue ? "Hide Dialogue" : "Show Dialogue"}
                        on:click={() => showDialogue = !showDialogue}
                        icon={showDialogue ? "speaker_notes" : "speaker_notes_off"}
                    />
                    <IconButton
                        title="Expand Page Image"
                        on:click={() => showImageModal = !showImageModal}
                        icon="aspect_ratio"
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
                        <img alt="no-page-image" class="page-image" style="--width: {pageWidth}px; --height: {pageWidth * 1.4}px;"
                            src={`${graphqlBase}/${sourceList[selectedImage]}?timestamp=${lastTimestamp}`}
                        >
                    {:else}
                        <h2>No image found, please upload one.</h2>
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