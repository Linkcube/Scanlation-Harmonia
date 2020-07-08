<script>
    import PageView from './SeriesComponents/PageView.svelte';
    import ChapterConfig from './SeriesComponents/ChapterConfig.svelte';
    import VolumeConfig from './SeriesComponents/VolumeConfig.svelte';
    import SeriesConfig from './SeriesComponents/SeriesConfig.svelte';
    import { pageMode, navOpen, viewMode, currentSeries, currentVolume, currentChapter, currentPage } from './store.js';
    import SeriesTable from './SeriesComponents/SeriesTable.svelte';
    import { IconButton } from 'linkcube-svelte-components';

    function seriesSelection() {
        currentVolume.set(null);
        currentChapter.set({});
        currentPage.set({});
        pageMode.set('series-select');
        viewMode.set("series");
    }
</script>

<style>
    .page-view-header {
		flex-shrink: 0;
        background: var(--background-color, white);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: 200px;
        position: fixed;
        width: calc(100% - 200px);
        transition-duration: 400ms;
        padding-top: 5px;
        z-index: 1;
    }

    .no-margin {
        margin-left: 0px;
        width: 100%;
    }

    .select-container {
        flex-direction: column;
        width: 200px;
        display: flex;
        position: fixed;
        top: 0px;
        left: 0px;
        height: 100%;
        transition-duration: 400ms;
        background: var(--background-color, white);
        z-index: 1;
    }

    .hide-nav {
        left: -200px;
    }

    .series-view-container {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
    }

    .right-side {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow-x: auto;
    }

    .nav-path {
        margin-top: auto;
        margin-bottom: auto;
        font-size: x-large;
    }

    .view-mode {
        margin-bottom: 20px;
        transition-duration: 400ms;
        padding-top: 50px;
        background: var(--background-color, white);
    }

    .nav-padding {
        padding-left: 200px;
    }

    a, a:hover, a:visited {
        color: var(--primary-text-color, black);
    }

    .home-container {
        margin-right: 10px;
    }

    .nav-container {
        margin-left: 10px;
    }
</style>


<main class="series-view-container">
    <div class="select-container" class:hide-nav={!$navOpen}>
        <SeriesTable></SeriesTable>
    </div>
    <div class="right-side">
        <div class="page-view-header flex-row" class:no-margin={!$navOpen}>
            <div class="nav-container">
                <IconButton
                    title="Toggle Navigation"
                    icon={$navOpen ? "menu_open" : "menu"}
                    on:click={navOpen.set(!$navOpen)}
                />
            </div>
            <div class="nav-path">
                <a on:click={() => viewMode.set("series")} href="#series">{$currentSeries}</a>
                {#if $viewMode === "page" || $viewMode === "volume" || $viewMode === "chapter"}
                     > <a on:click={() => viewMode.set("volume")} href="#volume">Vol. {$currentVolume}</a>
                    {#if $viewMode === "page" || $viewMode === "chapter"}
                     > <a on:click={() => viewMode.set("chapter")} href="#chapter">Ch. {$currentChapter.id} {$currentChapter.title}</a>
                    {/if}
                {/if}
            </div>
            <div class="home-container">
                <IconButton
                    icon="home"
                    title="Return to Series Selection"
                    on:click={seriesSelection}
                />
            </div>
        </div>
        <div class="view-mode" class:nav-padding={$navOpen}>
            {#if $viewMode === "page"}
                <PageView></PageView>
            {:else if $viewMode === "chapter"}
                <ChapterConfig></ChapterConfig>
            {:else if $viewMode === "volume"}
                <VolumeConfig></VolumeConfig>
            {:else if $viewMode === "series"}
                <SeriesConfig></SeriesConfig>
            {/if}
        </div>
    </div>
</main>