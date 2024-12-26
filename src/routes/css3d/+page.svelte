<script lang="ts">
    import "$lib/app.css";
    import "katex/dist/katex.min.css";
    import { init, animate } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";

    onMount(() => {
        init();
        animate();
    });
</script>

<div class="equation" id="propertime">
    {@html katex.renderToString("\\tau =0")}
</div>
<canvas id="canvas"> </canvas>
