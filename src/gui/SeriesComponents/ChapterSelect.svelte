<script>
    import ChapterTable from './ChapterTable.svelte';
    import { viewMode, currentVolume, currentChapter, currentPage } from '../store.js'

    function select_chapter(id) {
        if (id.hasOwnProperty("series")) {
            viewMode.set("series");
        } else if (id.hasOwnProperty("ch")) {
            viewMode.set("page");
            currentChapter.set({
                id: id.ch,
                title: id.title
            });
            currentVolume.set(id.vol);
        } else if (id.hasOwnProperty("vol")) {
            viewMode.set("volume");
            currentVolume.set(id.vol);
        }
        currentPage.set(1);
    }

    const volumes = [
        {
            volume: 1,
            chapters: [
                {
                    chapter: 1,
                    title: "Hello World",
                },
                {
                    chapter: 2,
                    title: "Hi there",
                },
                {
                    chapter: 3,
                    title: "Well then",
                },
                {
                    chapter: 4,
                    title: "I'm off!"
                }
            ]
        },
        {
            volume: 2,
            chapters: [
                {
                    chapter: 1,
                    title: "Hello World",
                },
                {
                    chapter: 2,
                    title: "Hi there",
                },
                {
                    chapter: 3,
                    title: "Well then",
                },
                {
                    chapter: 4,
                    title: "I'm off!"
                }
            ]
        },
        {
            volume: 3,
            chapters: [
                {
                    chapter: 1,
                    title: "Hello World",
                },
                {
                    chapter: 2,
                    title: "Hi there",
                },
                {
                    chapter: 3,
                    title: "Well then",
                },
                {
                    chapter: 4,
                    title: "I'm off!"
                }
            ]
        },
        {
            volume: 4,
            chapters: [
                {
                    chapter: 1,
                    title: "Hello World",
                },
                {
                    chapter: 2,
                    title: "Hi there",
                },
                {
                    chapter: 3,
                    title: "Well then",
                },
                {
                    chapter: 4,
                    title: "I'm off!"
                }
            ]
        }
    ]
</script>

<style>
    .chapter-container {
        height: 25%;
        overflow-y: auto;
    }

    .full-container {
        height: 100%;
        overflow-y: auto;
    }
</style>

<div class="{ $viewMode === 'page' ? 'chapter-container' : 'full-container'}">
    <div class="chapter-select-title">
        Config Select
    </div>
    <div class="chapter-select-container">
        <ChapterTable data={volumes} on:selected={(event) => select_chapter(event.detail)}></ChapterTable>
    </div>
</div>