<script context="module">
    const elements = new Set();
</script>

<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte'
    import { dialogueBubble, currentDialogue, pageData } from '../store.js';

    export let container;
    export let initialValues = false;
    export let tooltip = "";
    export let index;

    const dispatch = createEventDispatcher();

    let draggedDialogue = false;
    let dialogue;
    let offsetDragLeft = 0;
    let offsetDragTop = 0;
    let showDialogue;
    let dialogueH = 40;
    let dialogueW = 40;
    let originalDialogueW;
    let originalDialogueH;
    let originalDialogueY;
    let originalDialogueX;
    let originalPointerX;
    let originalPointerY;
    let scaleTarget;
    let minDialogueWidth = 40;
    let minDialogueHeight = 40;
    let clickedDialogue;
    let relativeX = 0;
    let relativeY = 0;

    if (initialValues) {
        relativeX = initialValues.x;
        relativeY = initialValues.y;
        dialogueW = initialValues.width;
        dialogueH = initialValues.height;
    }

    onMount(() => {
        elements.add(dialogue);
        dialogue.deselect = () => clickedDialogue = false;
		return () => elements.delete(dialogue);
    });
    
    export function deselect() {
        clickedDialogue = false;
    }

    function startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        offsetDragLeft = e.x - dialogue.offsetLeft;
        offsetDragTop = e.y - dialogue.offsetTop;
        clickedDialogue = draggedDialogue = true;
        elements.forEach(element => {
			if (element !== dialogue) element.deselect();
        });
        dispatch('select');
    }

    function startScale(e) {
        e.preventDefault();
        e.stopPropagation();
        originalPointerX = e.x - e.target.offsetLeft;
        originalPointerY = e.y - e.target.offsetTop;
        originalDialogueH = dialogueH;
        originalDialogueW = dialogueW;
        originalDialogueY = relativeY + container.offsetTop;
        originalDialogueX = relativeX + container.offsetLeft;
        scaleTarget = e.target;
    }

    function trackMouse(e) {
        let dialogueX = relativeX + container.offsetLeft;
        let dialogueY = relativeY + container.offsetTop;
        if (scaleTarget) {
            let x = Math.max(Math.min(e.x, container.offsetLeft + container.offsetWidth), container.offsetLeft);
            let y = Math.max(Math.min(e.y, container.offsetTop + container.offsetHeight), container.offsetTop);
            let dx = x - originalPointerX;
            let dy = y - originalPointerY;
            if (scaleTarget.classList.contains("top-right")) {
                dialogueW = dx + scaleTarget.offsetWidth;
                let tempDialogueY = originalDialogueY + dy;
                if (tempDialogueY < (originalDialogueY + originalDialogueH - minDialogueHeight)) {
                    dialogueY = tempDialogueY;
                    dialogueH = originalDialogueH - dy;
                }
            } else if (scaleTarget.classList.contains("top-left")) {
                let tempDialogueX = originalDialogueX + dx;
                if (tempDialogueX < (originalDialogueX + originalDialogueW - minDialogueWidth)) {
                    dialogueX = tempDialogueX;
                    dialogueW = originalDialogueW - dx;
                }
                let tempDialogueY = originalDialogueY + dy;
                if (tempDialogueY < (originalDialogueY + originalDialogueH - minDialogueHeight)) {
                    dialogueY = tempDialogueY;
                    dialogueH = originalDialogueH - dy;
                }
            } else if (scaleTarget.classList.contains("bottom-left")) {
                let tempDialogueX = originalDialogueX + dx;
                if (tempDialogueX < (originalDialogueX + originalDialogueW - minDialogueWidth)) {
                    dialogueX = tempDialogueX;
                    dialogueW = originalDialogueW - dx;
                }
                dialogueH = dy + scaleTarget.offsetHeight;
            } else if (scaleTarget.classList.contains("bottom-right")) {
                dialogueW = dx + scaleTarget.offsetWidth;
                dialogueH = dy + scaleTarget.offsetHeight;
            }
            dialogueX = Math.max(dialogueX, container.offsetLeft);
            dialogueY = Math.max(dialogueY, container.offsetTop);
            dialogueW = Math.max(Math.min(dialogueW, container.offsetWidth - dialogue.offsetLeft), minDialogueWidth);
            dialogueH = Math.max(Math.min(dialogueH, container.offsetHeight - dialogue.offsetTop), minDialogueHeight);
            relativeX = dialogueX - container.offsetLeft;
            relativeY = dialogueY - container.offsetTop;
            dialogueBubble.set({
                x: relativeX,
                y: relativeY,
                width: dialogueW,
                height: dialogueH
            });
        } else if (draggedDialogue) {
            relativeX = Math.max(Math.min(e.x - offsetDragLeft, container.offsetWidth - dialogue.offsetWidth), 0);
            relativeY = Math.max(Math.min(e.y - offsetDragTop, container.offsetHeight - dialogue.offsetHeight), 0);
            dialogueX = relativeX + container.offsetLeft;
            dialogueY = relativeY + container.offsetTop;
            dialogueBubble.set({
                x: relativeX,
                y: relativeY,
                width: dialogueW,
                height: dialogueH
            });
        }
        
    }

    currentDialogue.subscribe((value) => {
        if (value === index) {
            clickedDialogue = true;
        } else {
            draggedDialogue = scaleTarget = clickedDialogue = false
        }
    });

    pageData.subscribe((promise) => {
        Promise.resolve(promise).then(response => {
            if (response.hasOwnProperty('data')) {
                let dialogueList = response.data.page.dialogue;
                if (index < dialogueList.length) {
                    relativeX = dialogueList[index].bubble.x;
                    relativeY = dialogueList[index].bubble.y;
                    dialogueW = dialogueList[index].bubble.width;
                    dialogueH = dialogueList[index].bubble.height;
                }
            }
        })
    });

    function releaseDrag(e) {
        if (draggedDialogue) {
            draggedDialogue = false;
        }
        if (scaleTarget) {
            scaleTarget = false;
        }
    }

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        clickedDialogue = true;
    }
</script>

<svelte:window
    on:mousemove={trackMouse}
    on:mouseup={releaseDrag}
    on:mousedown={() => draggedDialogue = scaleTarget = clickedDialogue = false}
/>

<style>
    .draggable-dialogue {
        border: 3px ridge red;
        width: var(--w);
        height: var(--h);
        position: absolute;
        top: var(--y);
        left: var(--x);
        cursor: move;
    }

    .scale {
        /* border: 3px groove goldenrod; */
        position: absolute;
        width: 15px;
        height: 15px;
        color: goldenrod;
    }

    .top-left {
        top: 0px;
        left: 0px;
        cursor: nw-resize;
        transform: rotate(180deg);
    }

    .top-right {
        top: 0px;
        right: 0px;
        cursor: ne-resize;
        transform: rotate(270deg);
    }

    .bottom-left {
        bottom: 0px;
        left: 0px;
        cursor: sw-resize;
        transform: rotate(90deg);
    }

    .bottom-right {
        bottom: 0px;
        right: 0px;
        cursor: se-resize;
    }
</style>

<div
    bind:this={dialogue}
    on:mousedown={startDrag}
    on:click={handleClick}
    title={tooltip}
    class="draggable-dialogue"
    style="--w: {dialogueW}px; --h: {dialogueH}px; --x: {relativeX}px; --y: {relativeY}px"
>
    {#if clickedDialogue}
        <div on:mousedown={startScale} class="top-left scale material-icons">signal_cellular_4_bar</div>
        <div on:mousedown={startScale} class="top-right scale material-icons">signal_cellular_4_bar</div>
        <div on:mousedown={startScale} class="bottom-left scale material-icons">signal_cellular_4_bar</div>
        <div on:mousedown={startScale} class="bottom-right scale material-icons">signal_cellular_4_bar</div>
    {/if}
</div>