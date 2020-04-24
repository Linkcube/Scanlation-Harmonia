<script>
    export let value = "";
    export let label = "";
    export let id = "";
    export let hint_text = "";
    export let resize = "both";
    export let height = 80;
    export let width = 250;
</script>

<style>
    textarea:hover {
        border-color: yellow;
    }

    textarea:focus {
        border-color: #3c8bff;
        transition-duration: 400ms;
        border-radius: 5px;
        outline: 0;
    }

    textarea {
        margin: 8px;
        border-width: 2px;
        height: var(--height);
        border-radius: 5px;
        width: var(--width);
        resize: var(--resize);
    }

    .form-field {
        display: flex;
        flex-direction: column;
        line-height: 40px;
    }

    .form-field-control {
        display: flex;
        flex-shrink: 1;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        position: relative;
        width: 100%;
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

    textarea:focus + .float-text {
        color: #3c8bff;
        transform: scale(.75, .75) translate(-10px, -20px);
        transition-duration: 400ms;
        padding: 0% 5% 0%;
        margin-left: 5%;
        background: white;
        background-clip: padding-box;
    }

    textarea:not(:placeholder-shown) + .float-text {
        transform: scale(.75, .75) translate(-10px, -20px);
        transition-duration: 400ms;
        padding: 0% 5% 0%;
        margin-left: 5%;
        background: white;
        background-clip: padding-box;
    }

    textarea:placeholder-shown + .float-text {
        transition-duration: 400ms;
    }

    .hint-text {
        color: lightgray;
        font-size: 14px;
        text-align: center;
        line-height: 0;
    }
</style>

<div>
    <div class="form-field">
        <div class="form-field-control">
            <textarea 
                {id}
                style="--resize: {resize}; --height: {height}px; --width: {width}px"
                bind:value={value}
                placeholder=" "
                on:blur
            />
            <label class="float-text">{label}</label>
        </div>
        <label class="hint-text">{hint_text}</label>
    </div>
</div>
