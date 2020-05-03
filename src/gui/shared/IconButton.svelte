<script>
    export let icon;
    export let title = "";
    export let type = "info";
    export let scaleX = 1;
    export let scaleY = 1;
</script>

<style>
    .info {
        color: grey;
    }

    .info:hover {
        box-shadow: 0px 6px  rgba(0,0,0,0.6);
    }

    .warn {
        color: rgb(255, 50, 50);
    }

    .warn:hover {
        box-shadow: 0px 6px  rgba(255, 50, 50, 0.8);
    }

    .material-icons {
        font-size: 24px;
        background-color: rgba(0,0,0,0);
        border: none;
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
        transition: 0.3s;
        border-radius:100px;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
        margin-bottom: 7px;
        -webkit-transform: scaleX(var(--scaleX)) scaleY(var(--scaleY));
        transform: scaleX(var(--scaleX)) scaleY(var(--scaleY));
    }

    .material-icons::-moz-focus-inner {
        border: 0;
    }
</style>

<div>
    <button
        title={title}
        class="material-icons {type}"
        style="--scaleX:{scaleX}; --scaleY:{scaleY}"
        on:click
        on:dragenter
        on:dragover
        on:drop
    >{icon}</button>
</div>