<script lang="ts">
    import "./planet.css";
    import "katex/dist/katex.min.css";
    import { init, symbols } from "./script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";

    onMount(() => {
        init();
    });
</script>

<div class="equation" id="propertime">
    {@html katex.renderToString(
        "\\frac{de_{\\alpha}}{d{\\tau}} = \\Gamma_{\\alpha\\beta}^{\\gamma}v^{\\beta}e_{\\gamma}",
    )}
</div>
<canvas id="canvas"> </canvas>
