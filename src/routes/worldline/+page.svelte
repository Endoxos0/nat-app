<script lang="ts">
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { init } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";

    onMount(init);
    onDestroy(console.clear);
</script>

<div class="dynamic-value" id="propertime">
    {@html katex.renderToString(`\\tau = 0`)}
</div>
<div id="three">
    <div id="css-renderer"></div>
    <div id="webgl-renderer"></div>
</div>
