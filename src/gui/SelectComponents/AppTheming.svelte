<script>
    import { get } from 'svelte/store';
    import {
        MaterialButton,
        MaterialInput,
        PreviewCard,
        IconButton,
        MaterialTable,
        MaterialTableRow,
        MaterialSelect
    } from 'linkcube-svelte-components';
    import Modal from '../shared/Modal.svelte';
    import { currentThemeIndex, currentTheme, fetchGetAppThemes, fetchAddAppTheme, fetchEditAppTheme, fetchDeleteAppTheme } from '../store.js';

    let showModal = false;
    let styleEdit = false;
    let editIndex = 0;
    let editThemeStyle = {
        title: "",
        style: {}
    };
    let themes = [];

    function openStyleMenu() {
        fetchGetAppThemes().then((promise) => {
            Promise.resolve(promise).then(response => {
                if (response.hasOwnProperty('data')) {
                    themes = response.data.getAppThemes;
                }
                showModal = true;
                styleEdit = false;
            })
        });
    };

    function selectStyle(index) {
        editIndex = index;
        editThemeStyle.title = themes[editIndex].title;
        Object.assign(editThemeStyle.style, themes[editIndex].style);
        styleEdit = true;
    };

    function changeStyle() {
        themes = [];
        let oldIndex = get(currentThemeIndex);
        currentThemeIndex.set(-1);
        updateTheme(editThemeStyle.style);
        fetchEditAppTheme(editIndex, editThemeStyle).then((promise) => {
            Promise.resolve(promise).then(response => {
                if (response.hasOwnProperty('data')) {
                    themes = response.data.editAppTheme;
                    currentThemeIndex.set(oldIndex);
                }
            })
        });
        styleEdit = false;
    };

    function addTheme() {
        fetchAddAppTheme().then((promise) => {
            Promise.resolve(promise).then(response => {
                if (response.hasOwnProperty('data')) {
                    themes = response.data.addAppTheme;
                }
            })
        });
    };

    function deleteStyle() {
        let oldIndex = get(currentThemeIndex);
        currentThemeIndex.set(0);
        fetchDeleteAppTheme(editIndex).then((promise) => {
            Promise.resolve(promise).then(response => {
                if (response.hasOwnProperty('data')) {
                    themes = response.data.deleteAppTheme;
                    currentThemeIndex.set(oldIndex);
                }
            })
        });
        styleEdit = false;
    };

    function updateTheme(style) {
        currentTheme.set({
            "primary-color": style.primaryColor,
            "secondary-color": style.secondaryColor,
            "background-color": style.backgroundColor,
            "primary-text-color": style.primaryTextColor,
            "secondary-text-color": style.secondaryTextColor,
            "highlight-color": style.highlightColor,
            "focus-color": style.focusColor,
            "active-color": style.activeColor,
            "delete-color": style.deleteColor,
            "cancel-text-color": style.cancelTextColor,
            "cancel-background-color": style.cancelBackgroundColor,
            "submit-text-color": style.submitTextColor,
            "submit-background-color": style.submitBackgroundColor
        });
    };

    currentThemeIndex.subscribe((newTheme) => {
        if (themes[newTheme]) updateTheme(themes[newTheme].style);
    });

    fetchGetAppThemes().then((promise) => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                themes = response.data.getAppThemes;
            }
        })
    });
</script>

<style>
    .display-button {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .modal {
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
        justify-content: space-around;
    }

    .bottom-split {
        display: flex;
        flex-direction: column;
    }

    .left-side {
        display: flex;
        flex-direction: row;
    }

    .color-input {
        width: 40px;
        height: 40px;
        margin-left: 5px;
    }

    .color-edit {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 10px;
    }

    .color-edit label {
        margin: auto;
        margin-left: 0px;
    }

    .left-side span {
        margin: auto;
        margin-right: 10px;
    }

    .delete {
        --secondary-text-color: var(--delete-color, red);
    }
</style>

<div class="display-button">
    <MaterialButton value="Change Styling" on:click={openStyleMenu}></MaterialButton>
</div>


{#if showModal}
    <div class="modal">
        {#if styleEdit }
            <Modal on:close={() => styleEdit = false} on:submission={changeStyle}>
                <div class="top-row">
                    <MaterialInput label="Theme Title" bind:value={editThemeStyle.title}/>
                    {#if editIndex != 0}
                        <div class="delete">
                            <IconButton icon="delete_forever" title="Delete Style" on:click={deleteStyle}/>
                        </div>
                    {/if}
                </div>
                <div class="bottom-row">
                    <div class="bottom-split">
                        <div class="color-edit">
                            <label>Primary Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.primaryColor}>
                        </div>
                        <div class="color-edit">
                            <label>Secondary Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.secondaryColor}>
                        </div>
                        <div class="color-edit">
                            <label>Background Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.backgroundColor}>
                        </div>
                        <div class="color-edit">
                            <label>Primary Text Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.primaryTextColor}>
                        </div>
                        <div class="color-edit">
                            <label>Secondary Text Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.secondaryTextColor}>
                        </div>
                        <div class="color-edit">
                            <label>Highlight Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.highlightColor}>
                        </div>
                    </div>
                    <div class="bottom-split">
                        <div class="color-edit">
                            <label>Focus Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.focusColor}>
                        </div>
                        <div class="color-edit">
                            <label>Active Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.activeColor}>
                        </div>
                        <div class="color-edit">
                            <label>Delete Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.deleteColor}>
                        </div>
                        <div class="color-edit">
                            <label>Cancel Text Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.cancelTextColor}>
                        </div>
                        <div class="color-edit">
                            <label>Cancel Background Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.cancelBackgroundColor}>
                        </div>
                        <div class="color-edit">
                            <label>Submit Text Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.submitTextColor}>
                        </div>
                        <div class="color-edit">
                            <label>Submit Background Color </label>
                            <input type="color" class="color-input" bind:value={editThemeStyle.style.submitBackgroundColor}>
                        </div>
                    </div>
                </div>
            </Modal>
        {:else}
            <Modal on:close={() => showModal = false} use_submission={false}>
                <div class="top-row">
                    <div class="left-side">
                        <span>Style Configuration</span>
                        <IconButton icon="add_box" title="Add Style" on:click={addTheme}/>
                    </div>
                    <div class="right-side">
                        <MaterialSelect label="Active Theme" bind:value={$currentThemeIndex}>
                            {#each themes as theme, index }
                                <option value={index}>{theme.title}</option>
                            {/each}
                        </MaterialSelect>
                    </div>
                </div>
                <div class="bottom-row">
                    <MaterialTable items={themes} columnSizes={["20%", "80%"]} height="500px">
                        <div slot="header">
                            <MaterialTableRow values={["#", "Name"]} type="header"/>
                        </div>
                        <div slot="item" let:item let:index>
                            <MaterialTableRow
                                values={[`${index + 1}.`, item.title]}
                                type="click row"
                                on:click={() => selectStyle(index)}
                            />
                        </div>
                    </MaterialTable>
                </div>
            </Modal>
        {/if}
    </div>
{/if}