<script>
    import { viewMode, currentVolume, currentChapter, currentPage, currentSeries, seriesTree, fetchPageData, currentDialogue, pageData } from '../store.js'
    import TableItem from './TableItem.svelte';
    import FancyTable from '../shared/FancyTable.svelte';
    import FancyTableRow from '../shared/FancyTableRow.svelte';

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
<FancyTable items={seriesData} columnSizes={["100%"]}>
    <div slot="header">
        <FancyTableRow
            values={[$currentSeries]}
            on:click={() => selectItem({})}
            type="click header"
        />
    </div>
    <div slot="item" let:item={volume} let:index={volumeIndex}>
        <FancyTableRow
            values={[`Volume ${volumeIndex+1}`]}
            on:click={() => selectItem({ volume: volume.id })}
            type="click row expand"
        >
            <div slot="children">
                <FancyTable items={volume.chapters} columnSizes={["90%"]}>
                    <div slot="item" let:item={chapter} let:index={chapterIndex}>
                        <FancyTableRow
                            values={[`Chapter ${chapterIndex+1}`]}
                            on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, title: chapter.title })}
                            type="click row expand"
                            depth=1
                        >
                            <div slot="children">
                                <FancyTable items={chapter.pages} columnSizes={["100%"]}>
                                    <div slot="item" let:item={page} let:index={pageIndex}>
                                        <FancyTableRow
                                            values={[`Page ${pageIndex+1}`]}
                                            on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, page: page.id, title: chapter.title })}
                                            type="click row"
                                            depth=5
                                        />
                                    </div>
                                </FancyTable>
                            </div>
                        </FancyTableRow>
                    </div>
                </FancyTable>
            </div>
        </FancyTableRow>
    </div>
</FancyTable>
</div>