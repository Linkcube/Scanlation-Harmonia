<script>
    export let value;
    export let label = "";

    let width = 120;

    function updateSize() {
        if (label.length === 0) {
            width = 40 + (10 * JSON.stringify(value).length);
        }
    }

    function scale(node, value) {
        return {
            update(value) {
                updateSize();
            },
            destroy() {}
        }
    }

    updateSize();
</script>

<style>
    .form-field {
        display: flex;
        flex-direction: column;
        line-height: 40px;
        margin-top: auto;
        margin-bottom: auto;
    }

    .form-field-control {
        display: flex;
        flex-shrink: 1;
        border-radius: 8px 8px 0 0;
        /* overflow: hidden; */
        position: relative;
        width: 100%;
    }

    select {
        margin: 8px;
        height: 40px;
        color: black;
        box-sizing: border-box;
        margin: 0;
        border-radius: 5px;
        border-width: 2px;
        border-color: lightgray;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        min-width: var(--width);
        cursor: pointer;
    }
    
    select::-ms-expand {
        display: none;
    }
    
    select:hover {
        border-color: yellow;
    }
    
    select:focus {
        color: #3c8bff;
        transition-duration: 400ms;
        color: #222;
        outline: none;
        border-color: #3c8bff;
    }

    .float-text {
        font-weight: normal;
        font-size: large;
        left: 0;
        margin: 0;
        padding-left: 15px;
        padding-top: 7px;
        position: absolute;
        top: 0;
        pointer-events: none;
        background: none;
        color: gray;
        
    }

    select:focus + .float-text {
        color: #3c8bff;
        transform: scale(.75, .75) translate(-10px, -30px);
        transition-duration: 400ms;
        padding: 0% 5% 0%;
        margin-left: 5%;
        background: white;
        background-clip: padding-box;
    }

    select:not(:placeholder-shown) + .float-text {
        transform: scale(.75, .75) translate(-10px, -30px);
        transition-duration: 400ms;
        padding: 0% 5% 0%;
        margin-left: 5%;
        background: white;
        background-clip: padding-box;
    }

    select:placeholder-shown + .float-text {
        transition-duration: 400ms;
    }

    .material-icons {
        color: lightgray;
        margin: auto;
        margin-left: -30px;
        pointer-events: none;
    }

    select:focus + .material-icons {
         color: #3c8bff;
    }
</style>

<div class="form-field">
    <div class="form-field-control">
        <select bind:value={value} use:scale={value} on:blur on:change on:input style="--width: {width}px;">
            <slot></slot>
        </select>
        <label class="float-text">{label}</label>
        <div class="material-icons">arrow_drop_down</div>
    </div>
</div>