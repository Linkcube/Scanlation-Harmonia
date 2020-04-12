<script>
    import { pageDialogue, fetchSaveDialogue, currentSeries, currentVolume, currentChapter,currentPage,
    currentDialogue, fetchDeleteDialogue, fetchPageData, dialogueBubble, seriesStyles } from '../store.js';
    import Modal from './Modal.svelte';

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
    }

    .center-text {
        display: flex;
        flex-direction: row;
        justify-content: center;;
    }

    textarea.user-input {
        height: 250px;
        width: 350px;
        resize: none;
    }

    textarea.regex-result {
        height: 150px;
        min-width: 350px;
        resize: none;
    }

    .style-selection {
        display: inline-flex;
        margin-top: auto;
        margin-bottom: auto;
    }

    .save-btn {
        height: 37px;
        margin-top: auto;
        margin-bottom: auto;
    }

    .dialogue-settings {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    select, input {
        height: 37px;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>

<div class="selected-dialogue">
    {#if $currentDialogue >= 0 }
        <div class="dialogue-settings">
            <h2>Dialogue: </h2>
            <input bind:value={config.title} on:blur={save}>
            <div class="style-selection">
                <p>Dialogue Style:</p>
                <select bind:value={config.style} on:blur={save}>
                    {#each styleList as style, index}
                        <option value={index}>{style.title}</option>
                    {/each}
                </select>
            </div>
            <!-- <input type="button" value="Save" class="save-btn" on:click={save}> -->
            <input type="button" value="Delete" class="save-btn" on:click={() => showModal = true}>
        </div>
        <div class="center-text">
            <textarea class="user-input" placeholder="Raw Text" bind:value={config.raw} on:blur={save}></textarea>
            <textarea class="user-input" placeholder="Translated Text" bind:value={config.translated} on:blur={save}></textarea>
        </div>
        <!-- <div class="center-text">
            <textarea class="regex-result" placeholder="Raw Text Regex" readonly></textarea>
            <textarea class="regex-result" placeholder="Translated Text Regex" readonly></textarea>
        </div> -->
    {/if}
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={deleteDialogue}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}