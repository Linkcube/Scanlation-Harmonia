<script>
    import { onMount } from 'svelte';
    import TableItem from './TableItem.svelte';
    import Modal from '../shared/Modal.svelte';
    import { fetchGetStyles, fetchAddStyle, fetchEditStyle, currentSeries, seriesStyles, fetchDeleteStyle } from '../store.js';
    import FancyButton from '../shared/FancyButton.svelte';
    import FancyInput from '../shared/FancyInput.svelte';
    import FancyTextArea from '../shared/FancyTextArea.svelte';

    let openNew = false;

    function selectStyle(index) {
        styleTitle = styleList[index].title;
        styleAttributes = styleList[index].attributes;
        styleIndex = index;
        showModal = true;
    }

    function addStyle() {
        fetchAddStyle($currentSeries).then(fetchGetStyles($currentSeries));
        openNew = true;
    }

    function submit() {
        fetchEditStyle($currentSeries, styleIndex, styleTitle, styleAttributes).then(fetchGetStyles($currentSeries));
    }

    function deleteStyle() {
        fetchDeleteStyle($currentSeries, styleIndex).then(fetchGetStyles($currentSeries));
        showModal = false;
    }

    let styleList = [];

    let styleTitle = "";
    let styleAttributes = "";
    let styleIndex = 0;
    let showModal = false;

    onMount(() => {
        fetchGetStyles($currentSeries);
    });

    seriesStyles.subscribe((stylePromise) => {
        Promise.resolve(stylePromise).then((response) => {
            if (response.hasOwnProperty('data')) {
                styleList = response.data.getStyles;
                if (openNew) {
                    selectStyle(styleList.length - 1);
                    openNew = false;
                }
            }
        });
    });


</script>

<style>
    .style-container {
        display: flex;
        flex-direction: column;
        width: 70%;
        margin: auto;
        margin-bottom: 20px;
    }
    .style-header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .style-selection {
        max-height: 700px;
        display: flex;
        flex-direction: column;
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
</style>

<div class="style-container">
    <div class="style-header">
        <h2>Style Configuration</h2>
        <FancyButton value="Add Style" on:click={addStyle}/>
    </div>
    <div class="style-selection">
        {#each styleList as style, index}
            <TableItem 
                itemType=""
                id={style.title}
                on:click={() => selectStyle(index)}
            ></TableItem>
        {/each}
    </div>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={submit}>
        <div class="top-row">
            <FancyInput label="Style Title" bind:value={styleTitle}/>
            <FancyButton value="Delete" type="warn" on:click={deleteStyle}/>
        </div>
        <div class="bottom-row">
            <FancyTextArea label="Style Attributes" bind:value={styleAttributes} width=500 resize="vertical"/>
        </div>
    </Modal>
{/if}