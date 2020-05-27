<script>
    import { currentSeries, currentVolume, currentChapter, currentPage, fetchOpenFolder } from '../store.js';
    import { IconButton } from 'linkcube-svelte-components';
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


<IconButton title={`Open ${scope} Folder`} icon={"folder_open"} on:click={openFolder}/>