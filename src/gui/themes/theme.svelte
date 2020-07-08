<script>
    import { currentTheme } from '../store.js';

    function themeString(themeDict) {
        let css = "";
        for (const [key, value] of Object.entries(themeDict)) {
            css += `--${key}:${value};`;
        }
        return css;
    }

    $: style = themeString($currentTheme);
</script>

<style>
    :global(html, body) {
        --primary-color: var(--primary-color);
        --secondary-color: var(--secondary-color);
        --background-color: var(--background-color);
        --primary-text-color: var(--primary-text-color);
        --secondary-text-color: var(--secondary-text-color);
        --highlight-color: var(--highlight-color);
        --focus-color: var(--focus-color);
        --active-color: var(--active-color);
    }

    :global(.delete) {
        --delete-color: var(--delete-color);
    }

    :global(.modal .cancel) {
        --button-text-color: var(--cancel-text-color);
	    --button-background-color: var(--cancel-background-color);
    }

    :global(.modal .submit) {
        --button-text-color: var(--submit-text-color);
	    --button-background-color: var(--submit-background-color);
    }
</style>

<body {style}>
    <slot />
</body>
