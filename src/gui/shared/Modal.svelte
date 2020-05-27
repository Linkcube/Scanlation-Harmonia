<script>
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { MaterialButton } from 'linkcube-svelte-components';
	
	export let use_submission = true;

	const dispatch = createEventDispatcher();
    const close = () => dispatch('close');
    const submission = () => {
        dispatch('submission');
        dispatch('close');
    }

	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-background" on:click={close}></div>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
	<slot name="header"></slot>
    <br>
	<slot></slot>
    <br>
    <div class="user-actions">
		{#if use_submission}
			<div class="cancel">
				<MaterialButton on:click={close} value="Cancel"/>
			</div>
			<div class="submit">
			<MaterialButton on:click={submission} value="Accept"/>
			</div>
		{:else}
			<div class="submit">
				<MaterialButton on:click={close} value="Close" type="submit"/>
			</div>
		{/if}
    </div>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
		z-index: 1;
	}

	.modal {
		position: fixed;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 38em;
		max-height: 70%;
		overflow: auto;
		transform: translate(-50%,-50%);
		padding: 1em;
		border-radius: 0.2em;
		background: var(--background-color, white);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.29);
		z-index: 2;
	}

    .user-actions {
        display: flex;
        justify-content: flex-end;
		line-height: 40px;
		-webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
    }

	.cancel {
		--primary-text-color: var(--button-text-color, red);
		--secondary-color: var(--button-background-color, rgb(253, 229, 232));
	}

	.submit {
		--primary-text-color: var(--button-text-color, blue);
		--secondary-color: var(--button-background-color, rgb(235, 246, 250));
	}
</style>
