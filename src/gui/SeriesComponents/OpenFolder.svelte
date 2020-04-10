<script>
    import { currentSeries, currentVolume, currentChapter, currentPage, fetchOpenFolder } from '../store.js';
    export let scope;

    function openFolder() {
        if (scope === "Page") {
            fetchOpenFolder($currentSeries, $currentVolume, $currentChapter.id, $currentPage);
        } else if (scope === "Chapter") {
            fetchOpenFolder($currentSeries, $currentVolume, $currentChapter.id);
        } else if (scope === "Volume") {
            fetchOpenFolder($currentSeries, $currentVolume);
        } else {
            fetchOpenFolder($currentSeries);
        }
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    input {
        height: 37px;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>



<div class="container">
    <input type="button" value={`Open ${scope} Folder`} class="save-btn" on:click={openFolder}>
</div>