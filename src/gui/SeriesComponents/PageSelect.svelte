<script>
    import PreviewCard from 'svelte-preview-card';
    import { currentPage } from '../store.js';

    function selectPage(pageId) {
        currentPage.set(pageId);
    }

    const pages = [
        { id: 1, src: null},
        { id: 2, src: null},
        { id: 3, src: null},
        { id: 4, src: null},
        { id: 5, src: null},
        { id: 6, src: null},
        { id: 7, src: null},
        { id: 8, src: null},
    ]
</script>

<style>
    .page-select-container {
        display: flex;
        flex-direction: column;
        height: 75%;
    }

    .page-select-cards {
        overflow-y: auto;
        flex-direction: row;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        justify-content: center;
        max-height: 1000px;
    }

    .bottom-buffer {
        padding: 10px;
        width: 100%;
    }
</style>

<div class="page-select-container">
    <div class="page-select-title">
        Page Select
    </div>
    <!-- <div class="spacer"></div> -->
    <div class="page-select-cards">
        {#each pages as page}
            <PreviewCard primary_text={`Page ${page.id}`} on:open={() => selectPage(page.id)} src={page.src}></PreviewCard>
        {/each}
        <div class="bottom-buffer"></div>
    </div>
    <!-- <div class="spacer"></div> -->
</div>