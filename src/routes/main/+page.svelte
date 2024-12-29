<script>
    import "$lib/index.css";
    import "katex/dist/katex.min.css";
    import { init, cleanup } from "../worldline/script";
    import { onMount, onDestroy } from "svelte";
    import katex from "katex";
    onMount(init);
    onDestroy(console.clear);
</script>

<div class="container">
    <div class="dynamic-value" id="propertime">
        {@html katex.renderToString(`\\tau = 0`)}
    </div>
    <div>
        <div id="css-renderer"></div>
        <div id="webgl-renderer"></div>
    </div>
    <div class="sidebar">
        <div class="paragraph">
            Het beeld hiernaast vertegenwoordigt de structuur van ons universum:
            ruimtetijd. Ruimtetijd heeft 4 dimensies, maar om te vereenvoudigen
            worden hiernaast slechts twee weergegeven. De curve die is getekend
            beschrijft een object. De curve is de <b>wereldlijn</b> van het object.
        </div>
        <div class="paragraph">
            Om deze wereldlijn te interpreteren, verdeel je de curve in kleine
            gelijkmatig verdeelde intervallen. Vervolgens kies je één punt als
            oorsprong en nummer je de punten één voor één. Nu is de curve
            voorzien van een progressie. De opeenvolgende punten stellen nu een
            traject voor. De curve representeert de beweging van het object door
            ruimtetijd. De verdeling waarlangs het object beweegt heet de <b
                >eigentijd</b
            >
            van het object en wordt aangeduid met de Griekse letter {@html katex.renderToString(
                "\\tau",
            )} (tau). De eigentijd van het object is de tijd dat zijn interne evolutie
            regeert, oftewel de tijd die voorbij zo gaan op zijn eigen klok.
        </div>
        <div class="paragraph">
            Nu het concept van beweging is bepaald, moet de positie van het
            object worden beschreven naarmate eigentijd verstrijkt.
        </div>
        <div class="paragraph">
            Om een punt wiskundig te beschrijven, teken je op het oppervlak een
            assenstelsel. Dit assenstelsel heeft een oorsprong, waaruit de
            gridlijnen worden geteld, op deze manier kan je de positie van het
            object bepalen met twee getallen, zijn coördinaten. Het assenstelsel
            dat gebruikt wordt, is onafhankelijk van de werkelijke positie van
            het object, het is simpelweg een abstract hulpmiddel om punten te
            beschrijven met getallen. Afhankelijk van de situatie zijn sommige
            assenstelsels beter passend dan anderen.
        </div>
        <div class="paragraph">
            De vectoriële snelheid van het object in ruimtetijd is een vector
            die raakt aan de curve. De lengte van deze vector is de snelheid
            waarmee het object beweegt in ruimte tijd. Deze snelheid is overal
            gelijk, want de intervallen zijn regelmatig verdeeld. In andere
            woorden, voor een gegeven eigentijd, beweegt het object altijd
            dezelfde afstand. Algemener, <i>alle</i> objecten in het universum
            bewegen met deze snelheid (door ruimtetijd), de lichtsnelheid ({@html katex.renderToString(
                "c",
            )}). En dus {@html katex.renderToString(
                "\\left\\lVert \\overrightarrow{v}\\right\\rVert = c",
            )} (de norm van de vector is altijd de lichtsnelheid)
        </div>
        <div class="paragraph">
            Om de snelheid te beschrijven met de coördinaten, teken je startend
            vanaf het object twee pijlen die richting van elk coördinaat
            aangeeft. Deze pijlen heten basisvectoren ({@html katex.renderToString(
                "e_0, e_1",
            )}). Met deze twee basisvectoren kan je de snelheidsvector ontbinden
            tot een som van hun veelvouden, een liniaire combinatie. oftewel {@html katex.renderToString(
                "\\overrightarrow{v} = v^0\\overrightarrow{e_0} + v^1\\overrightarrow{e_1}",
            )}.
        </div>
    </div>
</div>
