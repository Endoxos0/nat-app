<script>
    import * as math from "$lib/math";
    import "katex/dist/katex.min.css";
    import "$lib/app.css";
    const arr = Object.keys(math).map((key) => math[key]);
</script>

{#each arr as item}
    <p>{@html item}</p>
{/each}
