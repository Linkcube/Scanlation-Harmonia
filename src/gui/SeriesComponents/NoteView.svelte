<script>
    import { onMount } from 'svelte';
    import { currentSeries, currentVolume, currentChapter, currentPage, fetchGetNotes, fetchSaveNotes } from '../store.js';
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

    .text {
        margin-top: auto;
        margin-bottom: auto;
    }

    textarea.notes-field {
        height: 500px;
        width: 700px;
        resize: none;
    }

    select, input {
        height: 37px;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>



<div class="note-scope">
    <div class="text">
        <h2>Note Scope</h2>
    </div>
    <select bind:value={selected} on:change={changeNoteScope}>
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
    </select>
    <!-- <input type="button" value="Save" class="save-btn" on:click={saveNote}> -->
</div>
<div class="center-text">
    <textarea class="notes-field" placeholder="Notes" bind:value={noteValue} on:blur={saveNote}></textarea>
</div>