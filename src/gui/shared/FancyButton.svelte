<script>
    export let type = "info";
    export let value;
</script>

<style>
    
    div {
        display: flex;
        line-height: 40px;
        margin-left: 5px;
        margin-right: 5px;
    }

    .container {
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 5px;
        height: 40px;
        cursor: pointer;
        margin-top: auto;
        margin-bottom: auto;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
    }

    .info {
        color: #4a4a4a;
        border: 1px lightgray solid;
    }

    .info:hover {
        background: rgb(255, 254, 247);
        transition-duration: 400ms;
    }

    .warn {
        color: red;
        border: 1px red solid;
    }

    .warn:hover {
        background: rgb(253, 229, 232);
        transition-duration: 400ms;
    }

    .submit {
        color: blue;
        border: 1px blue solid;
    }

    .submit:hover {
        background: rgb(235, 246, 250);
        transition-duration: 400ms;
    }
</style>
<div>
    <span class="container {type}" on:click on:dragenter on:dragover on:drop>{value}</span>
</div>