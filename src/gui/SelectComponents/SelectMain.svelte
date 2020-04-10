<script>
    import PreviewCard from 'svelte-preview-card';
    import { pageMode, currentSeries, seriesList, fetchSeries, fetchSeriesTree, graphqlBase, fetchAddSeries } from '../store.js';

    function selectSeries(series) {
        currentSeries.set(series);
        fetchSeriesTree(series);
        pageMode.set(series);
    }

    function addSeries() {
        fetchAddSeries(newName).then(
            fetchSeries()
        );
    }

    const series = [];
    let newName = "";

    // seriesList.subscribe((promise) => {
    //     Promise.resolve(promise).then((response) => {
    //         if (resposne.hasOwnProperty('data')) {
    //             series = response.data.series;
    //         }
    //     })
    // })

    fetchSeries();
</script>

<style>
    main {
        flex-grow: 1;
        overflow-y: auto;
		background: var(--primary-color);
        display: flex;
        flex-direction: column;
        /* justify-content: flex-start; */
        height: 100%;
    }

    .title {
        text-align: center;
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
        border: 0px solid #f3f3f3; /* Light grey */
        border-top: 5px solid #3498db; /* Blue */
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
        <input placeholder="Series Name" bind:value={newName}>
        <input type="button" value="Add Series" on:click={addSeries}> 
    </div>    
    <div class="card-display">
        {#await $seriesList}
            <div class="loader"></div>
        {:then value}
            {#each value.data.series as series}
                <PreviewCard
                    primary_text={series.title}
                    sub_text="{series.volumes} Vol. {series.chapters} Chapters"
                    background_source={series.cover ? `${graphqlBase}/${series.cover}` : undefined}
                    on:open={() => selectSeries(series.title)}
                ></PreviewCard>
            {/each}
        {/await}
    </div>
</main>