<script>
	import SeriesSelect from './SeriesSelect.svelte';
	import SeriesView from './SeriesView.svelte';
	import { pageMode } from './store.js';
	import Theme from './themes/theme.svelte';
</script>

<style>
	.app-container {
		min-height: 100%;
		overflow: hidden;
		margin: 0px;
		display: flex;
		flex-direction: column;
		min-width: 700px;
	}
</style>

<Theme>
	<div class="app-container">
		{#if $pageMode === "series-select"}
			<SeriesSelect></SeriesSelect>
		{:else}
			<SeriesView></SeriesView>
		{/if}
	</div>
</Theme>
