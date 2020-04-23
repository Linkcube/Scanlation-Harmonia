<script>
    import { onMount } from 'svelte';
    import TableItem from './TableItem.svelte';
    import Modal from '../shared/Modal.svelte';
    import { fetchGetLanguages, fetchAddLanguage, fetchEditLanguage, currentSeries, seriesLanguages, fetchDeleteLanguage } from '../store.js';
    import FancyButton from '../shared/FancyButton.svelte';
    import IconButton from '../shared/IconButton.svelte';
    import FancyInput from '../shared/FancyInput.svelte';
    import FancyTextArea from '../shared/FancyTextArea.svelte';
    import FancyTable from '../shared/FancyTable.svelte';
    import FancyTableRow from '../shared/FancyTableRow.svelte';

    let openNew = false;

    function selectLanguage(index) {
        languageTitle = languageList[index].title;
        languageAttributes = languageList[index].attributes;
        languageIndex = index;
        showModal = true;
    }

    function addLanguage() {
        fetchAddLanguage($currentSeries).then(fetchGetLanguages($currentSeries));
        openNew = true;
    }

    function submit() {
        fetchEditLanguage($currentSeries, languageIndex, languageTitle, languageAttributes).then(fetchGetLanguages($currentSeries));
    }

    function deleteLanguage() {
        fetchDeleteLanguage($currentSeries, languageIndex).then(fetchGetLanguages($currentSeries));
        showModal = false;
    }

    let languageList = [];

    let languageTitle = "";
    let languageAttributes = "";
    let languageIndex = 0;
    let showModal = false;

    onMount(() => {
        fetchGetLanguages($currentSeries);
    });

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
</style>

<div class="language-container">
    <div class="language-header">
        <span>Languages</span>
        <IconButton icon="add_box" title="Add language" on:click={addLanguage}/>
    </div>
    <FancyTable items={languageList} columnSizes={["10%", "40%", "60%"]} height="500px">
        <div slot="header">
            <FancyTableRow values={["#", "Language", "Notes"]} type="header"/>
        </div>
        <div slot="item" let:item let:index>
            <FancyTableRow
                values={[`${index + 1}.`, item.title, item.attributes]}
                type="click row"
                on:click={() => selectLanguage(index)}
            />
        </div>
    </FancyTable>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={submit}>
        <div class="top-row">
            <FancyInput label="Language" bind:value={languageTitle}/>
            {#if languageIndex > 0}
                <IconButton icon="delete_forever" title="Delete Language" type="warn" on:click={deleteLanguage}/>
            {/if}
        </div>
        <div class="bottom-row">
            <FancyTextArea label="Language Notes" bind:value={languageAttributes} width=500 resize="vertical"/>
        </div>
    </Modal>
{/if}