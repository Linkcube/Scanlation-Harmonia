<script>
    import { onMount } from 'svelte';
    import Modal from '../shared/Modal.svelte';
    import {
        fetchGetStyles, fetchAddStyle, fetchEditStyle,
        seriesStyles, fetchDeleteStyle
    } from '../store.js';
    import {
        IconButton,
        MaterialInput,
        MaterialTextArea,
        MaterialTable,
        MaterialTableRow
    } from 'linkcube-svelte-components';

    let openNew = false;

    function selectStyle(index) {
        styleTitle = styleList[index].title;
        styleAttributes = styleList[index].attributes;
        styleIndex = index;
        showModal = true;
    }

    function addStyle() {
        fetchAddStyle().then(fetchGetStyles());
        openNew = true;
    }

    function submit() {
        fetchEditStyle(styleIndex, styleTitle, styleAttributes).then(fetchGetStyles());
    }

    function deleteStyle() {
        fetchDeleteStyle(styleIndex).then(fetchGetStyles());
        showModal = false;
    }

    let styleList = [];

    let styleTitle = "";
    let styleAttributes = "";
    let styleIndex = 0;
    let showModal = false;

    onMount(() => fetchGetStyles());

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
        width: 40%;
        min-width: 550px;
        margin-bottom: 20px;
    }
    .style-header {
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

<div class="style-container">
    <div class="style-header">
        <span>Style Configuration</span>
        <IconButton icon="add_box" title="Add Style" on:click={addStyle}/>
    </div>
    <MaterialTable items={styleList} columnSizes={["10%", "40%", "60%"]} height="500px">
        <div slot="header">
            <MaterialTableRow values={["#", "Name", "Style"]} type="header"/>
        </div>
        <div slot="item" let:item let:index>
            <MaterialTableRow
                values={[`${index + 1}.`, item.title, item.attributes]}
                type="click row"
                on:click={() => selectStyle(index)}
            />
        </div>
    </MaterialTable>
</div>

{#if showModal}
    <Modal on:close={() => showModal = false} on:submission={submit}>
        <div class="top-row">
            <MaterialInput label="Style Title" bind:value={styleTitle}/>
            <div class="delete">
                <IconButton icon="delete_forever" title="Delete Style" on:click={deleteStyle}/>
            </div>
        </div>
        <div class="bottom-row">
            <MaterialTextArea label="Style Attributes" bind:value={styleAttributes} width=500 resize="vertical"/>
        </div>
    </Modal>
{/if}