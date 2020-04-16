<script>
    import { seriesList } from '../store.js';
</script>

<style>
    header {
		flex-shrink: 0;
        background: var(--primary-color);
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-end;
        line-height: 40px;
    }
    
    p {
        color: var(--primary-color);
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
</style>

<header style="--primary-color:lightblue">
    <div class="text-alignment">
        <div>
            <p style="--primary-color:white">
                Scanlation Harmonia
            </p>
        </div>
        <div>
            {#await $seriesList then value}
                {#if Object.keys(value).length > 0}
                    <p style="--primary-color:white">
                        Series Found: { value.data.series.length }
                    </p>
                {:else}
                    <p style="--primary-color:white">
                        Series Found: #
                    </p>
                {/if}
            {/await}
        </div>
    </div>
</header>