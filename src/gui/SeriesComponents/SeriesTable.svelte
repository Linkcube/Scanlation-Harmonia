<script>
    import {
        viewMode, currentVolume, currentChapter, currentPage, currentSeries,
        seriesTree, fetchPageData, currentDialogue, pageData
    } from '../store.js'
    import {
        MaterialTable,
        MaterialTableRow
    } from 'linkcube-svelte-components';

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
            fetchPageData();
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
</style>

<div class="table-container">
    <MaterialTable items={seriesData} columnSizes={["100%"]}>
        <div slot="header">
            <MaterialTableRow
                values={[$currentSeries]}
                on:click={() => selectItem({})}
                type="click header"
            />
        </div>
        <div slot="item" let:item={volume} let:index={volumeIndex}>
            <MaterialTableRow
                values={[`Volume ${volumeIndex+1}`]}
                on:click={() => selectItem({ volume: volume.id })}
                type="click row expand"
            >
                <div slot="children">
                    <MaterialTable items={volume.chapters} columnSizes={["90%"]}>
                        <div slot="item" let:item={chapter} let:index={chapterIndex}>
                            <MaterialTableRow
                                values={[`Chapter ${chapterIndex+1}`]}
                                on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, title: chapter.title })}
                                type="click row expand"
                                depth=1
                            >
                                <div slot="children">
                                    <MaterialTable items={chapter.pages} columnSizes={["100%"]}>
                                        <div slot="item" let:item={page} let:index={pageIndex}>
                                            <MaterialTableRow
                                                values={[`Page ${pageIndex+1}`]}
                                                on:click={() => selectItem({ volume: volume.id, chapter: chapter.id, page: page.id, title: chapter.title })}
                                                type="click row"
                                                depth=5
                                            />
                                        </div>
                                    </MaterialTable>
                                </div>
                            </MaterialTableRow>
                        </div>
                    </MaterialTable>
                </div>
            </MaterialTableRow>
        </div>
    </MaterialTable>
</div>