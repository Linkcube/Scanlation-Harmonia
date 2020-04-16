<script>
    import { pageDialogue, fetchSaveDialogue, currentSeries, currentVolume, currentChapter,currentPage,
    currentDialogue, fetchDeleteDialogue, fetchPageData, dialogueBubble, seriesStyles } from '../store.js';
    import Modal from '../shared/Modal.svelte';
    import IconButton from '../shared/IconButton.svelte';
    import FancyInput from '../shared/FancyInput.svelte';
    import FancyTextArea from '../shared/FancyTextArea.svelte';
    import FancySelect from '../shared/FancySelect.svelte';

    const config = {
        title: '',
        style: '',
        raw: '',
        translated: ''
    };
    let styleList = [];
    let showModal = false;

    seriesStyles.subscribe((stylePromise) => {
        Promise.resolve(stylePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                styleList = response.data.getStyles;
            }
        });
    });

    pageDialogue.subscribe((dialoguePromise) => {
        Promise.resolve(dialoguePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                let dialogue = response.data.pageDialogue;
                config.title = dialogue.title;
                config.style = dialogue.style;
                config.raw = dialogue.raw;
                config.translated = dialogue.translated;
            }
        });
    });

    export function save() {
        if ($currentDialogue >= 0) {
            return fetchSaveDialogue(
                $currentSeries,
                $currentVolume,
                $currentChapter.id,
                $currentPage,
                $currentDialogue,
                config.title,
                config.style,
                config.raw,
                config.translated,
                $dialogueBubble
            ).then(
                fetchPageData($currentSeries, $currentVolume, $currentChapter.id, $currentPage)
            );
        }
        return Promise.resolve();
    }

    function deleteDialogue() {
        fetchDeleteDialogue(
            $currentSeries,
            $currentVolume,
            $currentChapter.id,
            $currentPage,
            $currentDialogue
        ).then(() => {
                fetchPageData($currentSeries, $currentVolume, $currentChapter.id, $currentPage);
                $currentDialogue = -1;
            }
        );
    }
</script>

<style>
    .selected-dialogue {
        display: flex;
        flex-direction: column;
        min-width: 350px;
    }

    .center-text {
        display: flex;
        flex-direction: row;
        justify-content: center;;
        flex-wrap: wrap;
    }

    .style-selection {
        display: inline-flex;
        margin-top: auto;
        margin-bottom: auto;
    }

    .dialogue-settings {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
    }
</style>

{#if $currentDialogue >= 0 }
    <div class="selected-dialogue">
        <div class="dialogue-settings">
            <FancyInput bind:value={config.title} label="Dialogue Title" on:blur={save}/>
            <div class="style-selection">
                <FancySelect bind:value={config.style} on:blur={save} label="Dialogue Style">
                    {#each styleList as style, index}
                        <option value={index}>{style.title}</option>
                    {/each}
                </FancySelect>
            </div>
            <IconButton icon="delete_forever" title="Delete Dialogue" type="warn" on:click={() => showModal = true}/>
        </div>
        <div class="center-text">
            <FancyTextArea label="Raw Text" bind:value={config.raw} on:blur={save} height=200 width=270 resize="none"/>
            <FancyTextArea label="Translated Text" bind:value={config.translated} on:blur={save} height=200 width=270 resize="none"/>
        </div>
    </div>
{/if}

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={deleteDialogue}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}