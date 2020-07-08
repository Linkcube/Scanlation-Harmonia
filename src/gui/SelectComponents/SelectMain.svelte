<script>
    // import PreviewCard from 'svelte-preview-card';
    import {
        pageMode, currentSeries, seriesList, fetchSeries,
        fetchSeriesTree, graphqlBase, fetchAddSeries,
        fetchGetExportFolder, fetchSetExportFolder
    } from '../store.js';
    import {
        MaterialButton,
        MaterialInput,
        PreviewCard
    } from 'linkcube-svelte-components';
    import AppTheming from './AppTheming.svelte';

    const series = [];
    let newName = "";
    let newFolder = "";

    function selectSeries(series) {
        currentSeries.set(series);
        fetchSeriesTree();
        pageMode.set(series);
    }

    function addSeries() {
        fetchAddSeries(newName).then(
            fetchSeries()
        );
    }

    function setFolder() {
        fetchSetExportFolder(newFolder).then((promise) => {
            Promise.resolve(promise).then((response) => {
                if (response.hasOwnProperty('data')) {
                    fetchSeries();
                }
            })
        });
    };

    fetchSeries();
    fetchGetExportFolder().then(promise => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                newFolder = response.data.getExportFolder;
            }
        })
    });
</script>

<style>
    main {
        flex-grow: 1;
        overflow-y: auto;
		background: var(--background-color, white);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .title {
        text-align: center;
    }

    .series-form {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .card-display {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: auto;
        justify-content: center;
    }

    .loader {
        margin-left: auto;
        margin-right: auto;
        border: 0px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<main>
    <div class="title">
        <h1>Series Selection</h1>
    </div>
    <div class="series-form">
        <MaterialInput label="Series Name" bind:value={newName} on:enter={addSeries}></MaterialInput>
        <MaterialButton value="Add Series" on:click={addSeries}></MaterialButton>
    </div>
    <AppTheming />
    <!-- <div class="series-form">
        <MaterialInput label="Series Folder Path" bind:value={newFolder} on:enter={setFolder}></MaterialInput>
        <MaterialButton value="Set Series Folder" on:click={setFolder}></MaterialButton>
    </div> -->
    <div class="card-display">
        {#await $seriesList}
            <div class="loader"></div>
        {:then value}
            {#each value.data.series as series}
                <PreviewCard
                    primaryText={series.title}
                    subText="{series.volumes} Vol. {series.chapters} Chapters"
                    backgroundSource={series.cover ? `${graphqlBase}/${series.cover}` : undefined}
                    on:click={() => selectSeries(series.title)}
                ></PreviewCard>
            {/each}
        {/await}
    </div>
</main>
