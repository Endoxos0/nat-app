<script lang="ts">
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { GeodesicsOnSphereScene } from "$lib/Scenes";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";
    let css: HTMLDivElement;
    let webgl: HTMLDivElement;
    onMount(() => new GeodesicsOnSphereScene(css, webgl).start());
    onDestroy(console.clear);
</script>

<section class="card renderer">
    <div bind:this={css} id="css-renderer"></div>
    <div bind:this={webgl} id="webgl-renderer"></div>
</section>
