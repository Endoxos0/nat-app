<!-- <script lang="ts">
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
                    "\\overrightarrow{e_0}, \\overrightarrow{e_1}",
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
        <section class="paragraph inactive">
            <p>
                In ruimte tijd, in de afwezigheid van krachten, bewegen objecten
                van nature in rechte lijnen.
            </p>
            <p>
                Op basis van deze overweging is er een methode te bedenken, om
                het traject van een object te voorspellen.
            </p>
            <p>
                Namelijk, zodra we de snelheid weten op een gegeven moment, is
                de beweging op elk ander moment duidelijk.
            </p>
            <p>Dit soort traject noemen we een <i>geodeet</i></p>
            <p>Op een geodeet, verandert de vector niet van richting</p>
            <p>
                In andere woorden, de afgeleide van de vector ten opzichte van
                eigentijd is nul.
            </p>
            {@html eq.dvdtauIsZero}
            <p>
                De beweging van objecten is van nature niet versnellend, en dus
                wanneer er geen krachten op objecten werkt, bewegen ze in een
                rechte lijn.
            </p>
            <p>
                Eerder zag je al een uitdrukking waarin snelheid werdt ontbonden
                in factoren met betrekking tot de basisvectoren.
            </p>
            <p>
                Als je de snelheid in de bovenstaande formule vervangt door die
                uitdrukking krijg je
            </p>
            {@html eq.dvdtauFactors1}
        </section>
        <section class="paragraph inactive">
            <p>
                De beweging van objecten is van nature niet versnellend, en dus
                wanneer er geen krachten op objecten werkt, bewegen ze in een
                rechte lijn.
            </p>
            <p>
                Eerder zag je al een uitdrukking waarin snelheid werd ontbonden
                in factoren met betrekking tot de basisvectoren.
            </p>
            <p>
                Als je de snelheid in de bovenstaande formule vervangt door die
                uitdrukking krijg je
            </p>
            {@html eq.dvdtauFactors1}
            <p>
                De afgeleide van een product is de som van elke term
                vermenigvuldigd met de afgeleide van de andere term.
            </p>
            <p>En dus krijg je</p>
            {@html eq.dvdtauFactors2}
            <p>
                Je krijgt een relatie tussen de verandering in de componenten
                van snelheid, en de verandering van de basisvectoren zelf.
            </p>
            <p>
                De basisvectoren kunnen wel degelijk veranderen door het
                traject, want het grid dat wordt gekozen als assenstelsel hoeft
                niet per se regelmatig te zijn.
            </p>
            <p>
                Hoewel de vector zelf niet veranderd, kunnen zijn componenten op
                het grid wel veranderen terwijl het object beweegt.
            </p>
            <p>
                De evolutie van een basisvector langs de wereldlijn kan ook
                worden ontbonden, tot de som van zijn verandering langs elk
                coordinaat, vermenigvuldigd met de snelheid van het object.
            </p>
            {@html eq.dedtau}
            <p>
                Dit is zo omdat hoe sneller het object beweegt, hoe sneller de
                basisvectoren zullen variëren.
            </p>
            <p>
                Voor elk coördinaat geeft dit een nieuwe hoeveelheid dat
                aangeeft hoe een basisvector verandert ten opzichte van dat
                coördinaat.
            </p>
            <p>
                Deze verandering wordt ook uitgedrukt als een vector en is de
                afgeleide van een basisvector ten opzichte van een bepaalde
                coördinaat.
            </p>
            <p>
                Dit is een speciale vector, want het hangt niet meer af van het
                traject van een object, maar alleen maar van de structuur van
                het assenstelsel zelf.
            </p>
            <p>
                Deze vector kan natuurlijk ook weer worden ontbonden tot zijn
                componenten, aangeduid met {@html eq.Gamma}.
            </p>
            <p>
                In 2 dimensies bestaan er wel 8 van deze componenten, 2
                componenten voor 4 verschillende vectoren.
            </p>
            <p>
                De getallen heten christoffel symbolen en zijn erg belangrijk in
                de algemene relativiteitstheorie, want ze vertellen hoe het grid
                verandert in elke richting.
            </p>
            <p>
                Als we de vorige vergelijking herschrijven met christoffel
                symbolen, krijgen we de geodetische vergelijking.
            </p>
            {@html eq.geodesicEquation}
            <p>
                Met deze vergelijking kunnen voor elk component van de snelheid,
                zijn mate van verandering, naarmate eigentijd voorbij gaat.
            </p>
            <p>
                De vergelijking maakt mogelijk om het volledige traject van een
                object te voorspellen, mits we zijn snelheid weten op een
                bepaald moment en de waarde van alle christoffel symbolen op elk
                punt in het grid.
            </p>
        </section>
        <section class="paragraph inactive" id="index">
            <p>
                Hoewel wel met ons assenstelsel punten kunnen plaatsen, geeft
                het geen informatie over de aftstand en hoeken tussen deze
                punten.
            </p>
            <p>
                De intervallen op het grid staan niet overal voor dezelfde
                aftstand of oriëntatie.
            </p>
            <p>
                Stel je hebt twee punten, je weet hun coördinaten en je wilt de
                afstand tussen de punten bepalen.
            </p>
            <p>
                In eerste instantie, zo je misschien denken aan de stelling van
                pythagoras.
            </p>
            <p>
                Echter, de stelling van pythagoras werkt alleen in een
                orthogonaal coördinatensysteem.
            </p>
            <p>
                Als de assen van het grid elkaar niet overal loodrecht snijden,
                is de stelling van pythagoras niet langer van toepassing.
            </p>
            <p>
                Er moet dus een algemenere formule worden gevonden dat werkt
                ongeacht van het grid dat wordt gebruikt.
            </p>
            <p>
                In het algemeen, het kwadraat van de afstand kan altijd worden
                geschreven als een som van alle mogelijke combinaties van
                producten, vermenigvuldigd met bepaalde coëfficienten.
            </p>
            <p>Deze coëfficienten hangen af van de vorm van het grid.</p>
            <p>
                In het speciale geval waar de gridlijnen vierkanten vormen van
                lengte 1, zijn deze coëfficienten respectievelijk 1, 0, 0, en 1.
                En de formule valt terug naar de stelling van pythagoras.
            </p>
            <p>
                De coëfficienten kunnen worden samengebracht tot een tabel, met
                één rij en één kolom voor elk coördinaat.
            </p>
            <p>
                Dit tabel is een metrische tensor, een tabel waarmee we kleine
                afstanden kunnen bepalen en wordt meestal aangeduid met {@html katex.renderToString(
                    "g",
                )}.
            </p>
            <p>Zijn componenten worden genummerd met twee indexen</p>
            <p>
                En dus kan het kwadraat van de afstand worden geschreven als de
                som van elk componennt van dit tabel, vermenigvuldigd met hun
                overeenkomstige verschillen tussen 2 punten.
            </p>
            <p>
                Met deze formule kunnen we ook de norm van de snelheidsvector
                uitdrukken.
            </p>
            <p>
                De veschillen van de coördinaten worden vervangen door de
                componenten van de snelheid.
            </p>
            <p>
                Met in gedachten dat de norm van de snelheid altijd de
                lichtsnelheid is, kunnen we een preciesere vorm van deze formule
                schrijven.
            </p>
            <p>
                Met de metrische tensor kunnen we ook de waarde van de
                christoffel-symbolen bepalen.
            </p>
            <p>
                De metrische tensor beschrijft de vorm van het grid, en de vorm
                van het grid is rechstreeks verwant aan hoe de basis vectoren
                veranderen.
            </p>
            <p>
                Dus door te meten hoe de metrische tensor verandert over het
                grid, kunnen we ook bepalen hoe de basisvectoren veranderen en
                dus ook de waarde van de christoffelsymbolen.
            </p>
            <p>
                Wanneer we deze berekening doen, krijgen we een uitdrukking dat
                afgeleiden van de metrische tensor betrekt.
            </p>
            <p>
                Meestal kan deze vergelijking worden versimpeld, door een
                geschikt coördinaten systeem te gebruiken
            </p>
            <p>
                Maar nu mist er weer een manier om de metrische tensor te
                bepalen.
            </p>
            <p>
                De kracht van deze abstracte modellen ligt in het feit dat het
                geen aannames maakt over de geometrie van ruimtetijd.
            </p>
            <p>
                Voorheen was ruimtetijd weergegeven als een plat vlak, maar
                niets houdt ons tegen om een gebogen vlak in te beelden.
            </p>
            <p>
                Ruimtetijd is namelijk niet altijd plat, zijn geometrie kan
                gebogen worden en zijn buiging heeft interessante gevolgen voor
                banen van objecten.
            </p>
            <p>
                Als ruimteijd bijvoorbeeld is gebogen als een bol, zullen twee
                parallele geodeten startend vanaf de evenaar dichter bij elkaar
                komen.
            </p>
            <p>
                De kromming van een oppervlak is een belangrijk concept in de
                algemene relativiteitstheorie, en zal nader gedefinieerd worden.
            </p>
        </section>
        <div class="filler"></div>
    </div>
</div> -->
