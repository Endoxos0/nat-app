<script>
    import "../app.css";
    import { init } from "./script";
    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        init();
        // // Handle hot module replacement
        // if (import.meta.hot) {
        //     import.meta.hot.dispose(() => {
        //         cleanup();
        //     });
        // }
    });

    // onDestroy(() => {
    //     cleanup();
    // });
</script>

<canvas id="canvas"> </canvas>
