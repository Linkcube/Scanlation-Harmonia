<script>
    import { seriesList } from '../store.js';
    import Modal from '../shared/Modal.svelte';

    let showModal = false;
</script>

<style>
    header {
		flex-shrink: 0;
        background: var(--primary-color, lightblue);
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-end;
        line-height: 40px;
    }
    
    header p {
        color: var(--background-color, white);
        margin: auto;
        text-align: center;
        font-size: 20px;
    }

    .text-alignment {
        display: inline-flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
    }

    img {
        height: 40px;
        cursor: pointer;
        background: white;
    }

    .modal {
        color: var(--primary-text-color, black);
    }
</style>

<header>
    <div class="text-alignment">
            <img
                src="./Static/logo_alpha2.png"
                alt="Scanlation Harmonia"
                on:click={() => showModal = true}
                title="More Info"
            >
        <div>
            {#await $seriesList then value}
                {#if Object.keys(value).length > 0}
                    <p>
                        Series Found: { value.data.series.length }
                    </p>
                {:else}
                    <p>
                        Series Found: #
                    </p>
                {/if}
            {/await}
        </div>
    </div>
</header>

{#if showModal}
    <div class="modal">
        <Modal use_submission={false} on:close={() => showModal = false}>
            <h2>Thank you for using Scanlation Harmonia!</h2>
            <h3>For first time users</h3>
            <p>Start off by entering the name of the series you're planning to work on, and then click add series. This will generate a volume, chapter, and page in the series to give you an idea of how this program works.</p>
            <h3>Usage and other information can be found in the below link.</h3>
            <p>Github Page <a href="https://github.com/Linkcube/Scanlation-Harmonia">Link</a></p>
        </Modal>
    </div>
{/if}