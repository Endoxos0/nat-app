<script lang="ts">
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { init, cleanup } from "../worldline/script";
    import { onMount, onDestroy } from "svelte";
    import * as eq from "$lib/math";
    import katex from "katex";
    import type { Action } from "svelte/action";
    onMount(init);
    onDestroy(console.clear);

    const onSideBarLoaded: Action = (node) => {
        const sidebar = document.querySelector("div.sidebar");
        if (!sidebar) return;
        const sections = [...document.querySelectorAll("section.paragraph")];

        var indexElement = sections[0];
        const markIndex = () => {
            let indexFound = false;
            for (let section of sections) {
                if (
                    section.getBoundingClientRect().bottom >
                        0.5 * window.innerHeight &&
                    !indexFound
                ) {
                    indexElement = section;
                    indexFound = true;
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            }
        };

        markIndex();
        sidebar.addEventListener("scroll", (event) => {
            markIndex();
        });
    };
</script>

<div class="container">
    <div class="dynamic-value" id="propertime">
        {@html katex.renderToString(`\\tau = 0`)}
    </div>
    <div>
        <div id="css-renderer"></div>
        <div id="webgl-renderer"></div>
    </div>
    <div class="sidebar" use:onSideBarLoaded>
        <div class="filler"></div>
        <section class="paragraph inactive">
            <p>
                Het vlak hiernaast vertegenwoordigt de structuur van ons
                universum: ruimtetijd.
            </p>
            <p>
                Ruimtetijd heeft 4 dimensies, maar om te vereenvoudigen worden
                hiernaast slechts twee weergegeven.
            </p>
        </section>
        <section class="paragraph inactive">
            <p>De curve die is getekend beschrijft een object.</p>
            <p>De curve is de <b>wereldlijn</b> van het object.</p>
        </section>
        <section class="paragraph inactive">
            <p>
                Om deze wereldlijn te interpreteren, verdeel je de curve in
                kleine gelijkmatig verdeelde intervallen.
            </p>
        </section>
        <section class="paragraph inactive">
            <p>
                Vervolgens kies je één punt als oorsprong en nummer je de punten
                één voor één.
            </p>
            <p>Nu is de curve voorzien van een progressie.</p>
            <p>De opeenvolgende punten stellen nu een traject voor.</p>
            <p>
                De curve representeert de beweging van het object door
                ruimtetijd.
            </p>
            <p>
                De verdeling waarlangs het object beweegt heet de <b
                    >eigentijd</b
                >
                van het object en wordt aangeduid met de Griekse letter {@html eq.properTime}
                (tau).
            </p>
            <p>
                De eigentijd van het object is de tijd dat zijn interne evolutie
                regeert, oftewel de tijd die voorbij zo gaan op zijn eigen klok.
            </p>
        </section>
        <section class="paragraph inactive">
            Nu het concept van beweging is bepaald, moet de positie van het
            object worden beschreven naarmate eigentijd verstrijkt.
        </section>
        <section class="paragraph inactive">
            <p>
                Om een punt wiskundig te beschrijven, teken je op het oppervlak
                een assenstelsel.
            </p>
            <p>
                Dit assenstelsel heeft een oorsprong, waaruit de gridlijnen
                worden geteld, op deze manier kan je de positie van het object
                bepalen met twee getallen, zijn coördinaten.
            </p>
            <p>
                Het assenstelsel dat gebruikt wordt, is onafhankelijk van de
                werkelijke positie van het object, het is simpelweg een abstract
                hulpmiddel om punten te beschrijven met getallen.
            </p>
            <p>
                Afhankelijk van de situatie zijn sommige assenstelsels beter
                passend dan anderen.
            </p>
        </section>
        <section class="paragraph inactive">
            <p>
                De vectoriële snelheid van het object in ruimtetijd is een
                vector die raakt aan de curve.
            </p>
            <p>
                De lengte van deze vector is de snelheid waarmee het object
                beweegt in ruimte tijd.
            </p>
            <p>
                Deze snelheid is overal gelijk, want de intervallen zijn
                regelmatig verdeeld.
            </p>
            <p>
                In andere woorden, voor een gegeven eigentijd, beweegt het
                object altijd dezelfde afstand.
            </p>
            <p>
                Algemener, <i>alle</i> objecten in het universum bewegen met
                deze snelheid (door ruimtetijd), de lichtsnelheid ({@html eq.c}).
            </p>
            <p>
                En dus {@html eq.vectorNormIsC} (de norm van de vector is altijd
                de lichtsnelheid)
            </p>
        </section>
        <section class="paragraph inactive">
            <p>
                Om de snelheid te beschrijven met de coördinaten, teken je
                startend vanaf het object twee pijlen die richting van elk
                coördinaat aangeeft.
            </p>
            <p>
                Deze pijlen heten basisvectoren ({@html katex.renderToString(
                    "e_0, e_1",
                )}).
            </p>
            <p>
                Met deze twee basisvectoren kan je de snelheidsvector ontbinden
                tot een som van hun veelvouden, een liniaire combinatie.
            </p>
            {@html eq.vectorDecomposed}
        </section>
        <section class="paragraph inactive">
            <p>
                In de algemene relativiteitstheorie, komt het vaak voor dat
                meerdere gelijksoortige termen worden opgeteld.
            </p>
            <p>
                Om uitdrukkingen korter te noteren wordt vaak slechts één term
                opgeschreven, en wordt het index-getal verplaats door een
                griekse letter. Dit is de Einstein-notatie.
            </p>
            <p>
                De ontbonden snelheidsvector wordt dan bijvoorbeeld {@html eq.einsteinNotationExample}
            </p>
        </section>
        <div class="filler"></div>
    </div>
</div>
