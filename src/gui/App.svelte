<script>
	import SeriesSelect from './SeriesSelect.svelte';
	import SeriesView from './SeriesView.svelte';
	import { pageMode } from './store.js';
</script>

<style>
	.app-container {
		min-height: 100%;
		overflow: hidden;
		margin: 0px;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="app-container">
	{#if $pageMode === "series-select"}
		<SeriesSelect></SeriesSelect>
	{:else}
		<SeriesView></SeriesView>
	{/if}
</div>
