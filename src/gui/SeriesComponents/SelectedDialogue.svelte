<script>
    import {
        pageDialogue, fetchSaveDialogue, currentDialogue,fetchDeleteDialogue,
        fetchPageData, dialogueBubble, seriesStyles, seriesLanguages
    } from '../store.js';
    import Modal from '../shared/Modal.svelte';
    import {
        IconButton,
        MaterialInput,
        MaterialSelect,
        MaterialTextArea
    } from 'linkcube-svelte-components';

    const config = {
        title: '',
        style: '',
        raw: '',
        translated: [''],
        language: 0
    };
    let styleList = [];
    let languageList = [];
    let showModal = false;

    seriesStyles.subscribe((stylePromise) => {
        Promise.resolve(stylePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                styleList = response.data.getStyles;
            }
        });
    });

    seriesLanguages.subscribe((languagePromise) => {
        Promise.resolve(languagePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                languageList = response.data.getLanguages;
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
                if (!Array.isArray(config.translated)) {
                    if (config.translated !== null) config.translated = [config.translated];
                    else config.translated = [""];
                }
            }
        });
    });

    export function save() {
        if ($currentDialogue >= 0) {
            return fetchSaveDialogue(
                config.title,
                config.style,
                config.raw,
                config.translated
            ).then(
                fetchPageData()
            );
        }
        return Promise.resolve();
    }

    function deleteDialogue() {
        fetchDeleteDialogue().then(() => {
                fetchPageData();
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

    .styled-selection {
        display: inline-flex;
        margin-top: 10px;
        margin-bottom: auto;
        margin-right: 5px;
        margin-left: 5px;
    }

    .dialogue-settings {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>

{#if $currentDialogue >= 0 }
    <div class="selected-dialogue">
        <div class="dialogue-settings">
            <MaterialInput bind:value={config.title} label="Dialogue Title" on:blur={save}/>
            <div class="styled-selection">
                <MaterialSelect bind:value={config.style} on:blur={save} label="Dialogue Style">
                    {#each styleList as style, index}
                        <option value={index}>{style.title}</option>
                    {/each}
                </MaterialSelect>
            </div>
            <div class="styled-selection">
                <MaterialSelect bind:value={config.language} on:blur={save} label="Languge">
                    {#each languageList as language, index}
                        <option value={index}>{language.title}</option>
                    {/each}
                </MaterialSelect>
            </div>
            <div class="delete">
                <IconButton icon="delete_forever" title="Delete Dialogue" on:click={() => showModal = true}/>
            </div>
        </div>
        <div class="center-text">
            <MaterialTextArea
                label="Raw Text"
                bind:value={config.raw}
                on:blur={save}
                height=200
                width=270
                resize="none"
            />
            <MaterialTextArea
                label="Translated Text"
                bind:value={config.translated[config.language]}
                on:blur={save}
                height=200
                width=270
                resize="none"
            />
        </div>
    </div>
{/if}

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={deleteDialogue}>
        <h2>Are you sure you want to delete this?</h2>
    </Modal>
{/if}