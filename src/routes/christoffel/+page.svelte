<script lang="ts">
    import "$lib/app.css";
    import "katex/dist/katex.min.css";
    import { animate, init } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";

    onMount(() => {
        init();
        // animate();
    });

    onDestroy(() => {
        console.clear();
    });
</script>

<div id="three">
    <div id="css"></div>
    <div id="webgl"></div>
</div>
