<script>
    import { onMount } from 'svelte';
    import {
        currentSeries, currentVolume, currentChapter,
        currentPage, fetchGetNotes, fetchSaveNotes
    } from '../store.js';
    import FancyTextArea from '../shared/FancyTextArea.svelte';
    import FancySelect from '../shared/FancySelect.svelte';
    export let scope;
    let selected;
    let noteValue;
    let unsub;

    function saveNote() {
        if (selected === "Page") {
            fetchSaveNotes(noteValue, $currentSeries, $currentVolume, $currentChapter.id, $currentPage);
        } else if (selected === "Chapter") {
            fetchSaveNotes(noteValue, $currentSeries, $currentVolume, $currentChapter.id);
        } else if (selected === "Volume") {
            fetchSaveNotes(noteValue, $currentSeries, $currentVolume);
        } else {
            fetchSaveNotes(noteValue, $currentSeries);
        }
    }

    function changeNoteScope() {
        let promise;
        if (selected === "Page") {
            promise = fetchGetNotes($currentSeries, $currentVolume, $currentChapter.id, $currentPage);
        } else if (selected === "Chapter") {
            promise = fetchGetNotes($currentSeries, $currentVolume, $currentChapter.id);
        } else if (selected === "Volume") {
            promise = fetchGetNotes($currentSeries, $currentVolume);
        } else {
            promise = fetchGetNotes($currentSeries);
        }
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                noteValue = response.data.getNotes;
            }
        })
    }

    if (scope === "Page") {
        if (unsub !== undefined) {
            unsub()
        }
        unsub = currentPage.subscribe(() => {
            selected = "Page";
            changeNoteScope();
        });
    } else if (scope == "Chapter") {
        if (unsub !== undefined) {
            unsub()
        }
        unsub = currentChapter.subscribe(() => {
            selected = "Chapter";
            changeNoteScope();
        });
    } else if (scope == "Volume") {
        if (unsub !== undefined) {
            unsub()
        }
        unsub = currentVolume.subscribe(() => {
            selected = "Volume";
            changeNoteScope();
        });
    } else {
        selected = "Series";
        changeNoteScope();
    }
</script>

<style>
    .note-scope {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .center-text {
        display: flex;
        flex-direction: row;
        justify-content: center;;
    }

    .note-container {
        min-width: 700px;
        margin-top: 20px;
    }
</style>


<div class="note-container">
    <div class="note-scope">
        <FancySelect bind:value={selected} on:change={changeNoteScope} label="Note Scope">
            {#if scope === "Page"}
                <option>Page</option>
            {/if}
            {#if scope === "Page" || scope === "Chapter"}
                <option>Chapter</option>
            {/if}
            {#if scope === "Page" || scope === "Chapter" || scope == "Volume"}
                <option>Volume</option>
            {/if}
            <option>Series</option>
        </FancySelect>
    </div>
    <div class="center-text">
        <FancyTextArea label="Notes" bind:value={noteValue} on:blur={saveNote} height=500 width=700 resize="none"/>
    </div>
</div>