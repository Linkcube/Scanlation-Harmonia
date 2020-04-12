<script>
    import { viewMode, currentVolume, currentChapter, currentPage, currentSeries, seriesTree, fetchPageData, currentDialogue, pageData } from '../store.js'
    import TableItem from './TableItem.svelte';

    function selectItem(item) {
        if (item.hasOwnProperty('page')) {
            viewMode.set("page");
            currentChapter.set({
                id: item.chapter,
                title: item.title
            });
            currentVolume.set(item.volume);
            currentPage.set(item.page);
            pageData.set(Promise.resolve({data: {page: {dialogue: [], sources: []}}}));
            $currentDialogue = -1;
            fetchPageData($currentSeries, item.volume, item.chapter, item.page);
        } else if (item.hasOwnProperty('chapter')) {
            viewMode.set("chapter");
            currentChapter.set({
                id: item.chapter,
                title: item.title
            });
            currentVolume.set(item.volume);
        } else if (item.hasOwnProperty('volume')) {
            viewMode.set("volume");
            currentVolume.set(item.volume);
        } else {
            viewMode.set("series");
        }
    }

    let seriesData = [];

    seriesTree.subscribe((promise) => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                seriesData = response.data.seriesTree;
            }
        })
    });
</script>

<style>
    .table-container {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .scrolling {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
</style>


<div class="table-container">
    <TableItem id={$currentSeries} itemType="series" on:click={() => selectItem({})}></TableItem>
    <div class="scrolling">
        {#each seriesData as volume}
            <TableItem
                id={volume.id}
                itemType="volume" 
                title={volume.title}
                on:click={() => selectItem({ volume: volume.id })}
            ></TableItem>
            {#each volume.chapters as chapter}
                <TableItem
                    id={chapter.id}
                    itemType="chapter"
                    title={chapter.title}
                    on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, title: chapter.title })}
                ></TableItem>
                {#each chapter.pages as page, index}
                    <TableItem
                        id={page.id}
                        itemType="page"
                        on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, page: page.id, title: chapter.title })}
                    ></TableItem>
                {/each}
            {/each}
        {/each}
    </div>
</div>