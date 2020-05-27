<script>
    import { onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import {
        fetchGetLanguages, fetchAddLanguage, fetchEditLanguage,
        seriesLanguages, fetchDeleteLanguage
    } from '../store.js';

    import {
        IconButton,
        MaterialInput,
        MaterialTable,
        MaterialTableRow,
        MaterialTextArea,
    } from 'linkcube-svelte-components';

    let openNew = false;

    function selectLanguage(index) {
        languageTitle = languageList[index].title;
        languageAttributes = languageList[index].attributes;
        languageIndex = index;
        showModal = true;
    }

    function addLanguage() {
        fetchAddLanguage().then(fetchGetLanguages());
        openNew = true;
    }

    function submit() {
        fetchEditLanguage(languageIndex, languageTitle, languageAttributes).then(fetchGetLanguages());
    }

    function deleteLanguage() {
        fetchDeleteLanguage(languageIndex).then(fetchGetLanguages());
        showModal = false;
    }

    let languageList = [];

    let languageTitle = "";
    let languageAttributes = "";
    let languageIndex = 0;
    let showModal = false;

    onMount(() => fetchGetLanguages());

    seriesLanguages.subscribe((languagePromise) => {
        Promise.resolve(languagePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                languageList = response.data.getLanguages;
                if (openNew) {
                    selectLanguage(languageList.length - 1);
                    openNew = false;
                }
            }
        });
    });


</script>

<style>
    .language-container {
        display: flex;
        flex-direction: column;
        width: 40%;
        min-width: 550px;
        margin-bottom: 20px;
    }
    .language-header {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .top-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .bottom-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    span {
        font-size: large;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>

<div class="language-container">
    <div class="language-header">
        <span>Languages</span>
        <IconButton icon="add_box" title="Add language" on:click={addLanguage}/>
    </div>
    <MaterialTable items={languageList} columnSizes={["10%", "40%", "60%"]} height="500px">
        <div slot="header">
            <MaterialTableRow values={["#", "Language", "Notes"]} type="header"/>
        </div>
        <div slot="item" let:item let:index>
            <MaterialTableRow
                values={[`${index + 1}.`, item.title, item.attributes]}
                type="click row"
                on:click={() => selectLanguage(index)}
            />
        </div>
    </MaterialTable>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={submit}>
        <div class="top-row">
            <MaterialInput label="Language" bind:value={languageTitle}/>
            {#if languageIndex > 0}
                <div class="delete">
                    <IconButton icon="delete_forever" title="Delete Language" on:click={deleteLanguage}/>
                </div>
            {/if}
        </div>
        <div class="bottom-row">
            <MaterialTextArea label="Language Notes" bind:value={languageAttributes} width=500 resize="vertical"/>
        </div>
    </Modal>
{/if}