<script lang="ts">
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { AbitraryGridScene } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";

    let css: HTMLDivElement;
    let webgl: HTMLDivElement;
    onMount(() => new AbitraryGridScene(css, webgl).start());
    onDestroy(console.clear);
</script>

<div class="dynamic-value" id="propertime">
    {@html katex.renderToString(`\\tau = 0`)}
</div>
<div id="three">
    <div bind:this={css} id="css-renderer"></div>
    <div bind:this={webgl} id="webgl-renderer"></div>
</div>
