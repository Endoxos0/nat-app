<script lang="ts">
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { init } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";
    let css: HTMLDivElement;
    let webgl: HTMLDivElement;
    onMount(() => init(css, webgl));
    onDestroy(console.clear);
</script>

<div id="three">
    <div bind:this={css} id="css-renderer"></div>
    <div bind:this={webgl} id="webgl-renderer"></div>
</div>
