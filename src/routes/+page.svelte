<script lang="ts">
    import katex from "katex";
    import {
        c,
        EFE,
        gravitationalConstant,
        KeplerThirdLaw as KeplersThirdLaw,
        Poissons,
        TproptoR,
        Laplacian,
        LaplacianFull,
        metricTensor,
        einsteinTensor,
        scalarCurvature,
        ricciTensor,
        energyImpulsTensor,
        properTime,
    } from "$lib/math";
    import * as m from "$lib/math";
    import "katex/dist/katex.min.css";
    import "$lib/index.css";
    import { init as WorldlineScene } from "./worldline/script";
    import { init as ChristoffelScene } from "./christoffel/script";
    const q = katex.renderToString;

    const onVisible = (
        node: HTMLElement,
        callback = (node: HTMLElement) => {},
    ) => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                callback(node);
                observer.disconnect();
            }
        });
        observer.observe(node);
    };

    const initRenderer = (
        node: HTMLElement,
        init: (css_renderer: HTMLElement, webgl_renderer: HTMLElement) => void,
    ) => {
        let css_renderer = node.querySelector("#css-renderer") as HTMLElement;
        let webgl_renderer = node.querySelector(
            "#webgl-renderer",
        ) as HTMLElement;
        init(css_renderer, webgl_renderer);
    };

    const renderScene = (
        node: HTMLElement,
        init: (css_renderer: HTMLElement, webgl_renderer: HTMLElement) => void,
    ) => {
        let css_renderer = node.querySelector("#css-renderer") as HTMLElement;
        let webgl_renderer = node.querySelector(
            "#webgl-renderer",
        ) as HTMLElement;
        init(css_renderer, webgl_renderer);
    };
</script>

<div class="cards">
    <section class="card title center">
        <div>
            <h1>Dark Matter</h1>
            <div class="horizontal-align">
                <h2>
                    + dark energy, Keplers third law, gravitational lensing and
                    Einstein's field equations
                </h2>
            </div>
            <div class="horizontal-align">
                <h3>Jouke van der Leij</h3>
                <h3>Bryan Visser</h3>
                <h3>Niels Kamps</h3>
                <h3>Timothy Nguyen</h3>
            </div>
        </div>
    </section>
    <section class="card title">
        <h1>Donkere Materie</h1>
        <p>
            Donkere materie is een hypothetische vorm van materie dat niet wordt
            beïnvloed door licht of electromagnetische straling. Zijn bestaan
            wordt gesuggereerd door zwaartekrachteffecten, onverklaarbaar door
            de algemene relativiteitstheorie, tenzij er meer materie is dan wat
            wordt waargenomen. Deze effecten treden op in meerdere contexten
            onder andere:
        </p>
        <ul>
            <li>Beweging van sterrenstelsels in sterrenstelselclusters</li>
            <li>Gravitatielenzen</li>
            <li>Kosmische achtergrondstraling</li>
            <li>
                Creatie van sterrenstelsels, clusters van sterrenstelsels en
                grotere structuren
            </li>
        </ul>
    </section>
    <section class="card video" id="3">
        <h1>Overzicht en Geschiedenis</h1>
        <iframe
            src="https://www.youtube.com/embed/j1_MrnDEL1M"
            title="voorstel natuurkunde"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        ></iframe>
    </section>
    <section class="card explainer">
        <h1>Rotatiekrommen van sterrenstelsels</h1>
        <p>
            De armen van spirale sterrenstelsels draaien rond hun galactisch
            centrum. De lichtgevende massa dichtheid neemt af als je verder van
            het centrum gaat. Als de lichtgevende massa ook alle materie
            bevatte, zou het sterrenstelsel gemodelleerd kunnen worden als een
            puntmassa, waaromheen massa's draaien, netzoals het zonnestelsel.
            Volgens Keplers Derde Wet wordt er dan verwacht dat de snelheid
            waarmee de massa's het centrum omcirkelen, afneemt met afstand tot
            het centrum ( {@html TproptoR}
            ). Dit is echter niet wat wordt waargenomen. In plaats daarvan blijft
            deze snelheid ongeveer constant.
        </p>
        <h2>Keplers Derde Wet</h2>
        {@html KeplersThirdLaw}
    </section>
    <section class="card explainer">
        <h1>Gravitatielenzen</h1>
        <p>
            Eén van de gevolgen de algemene relativiteitstheorie is de
            gravitatielens. Zwaartekrachtlensing treedt op wanneer massieve
            objecten tussen een lichtbron en de waarnemer als een lens fungeren
            om het licht van deze bron te buigen. Hoe massiever een object, hoe
            meer lenswerking er wordt waargenomen. Sterke lenswerking is de
            schijnbare vervorming van achtergrondsterrenstelsels in bogen
            wanneer hun licht door zo'n zwaartekrachtlens gaat. Door de mate van
            vervorming te meten, kan de massa van een tussenliggende cluster
            worden bepaald. Wederom, vereist de waargenomen lenswerking meer
            massa dan zichtbare materie kan verklaren.
        </p>
        <p>
            Maar waarom buigen massieve objecten licht? In werkelijkheid buigen
            massieve objecten alleen de ruimtetijd om zich heen, en licht volgt
            slechts de ruimtetijd. De <b>Einstein-Vergelijking</b> vat samen hoe
            objecten ruimtijd veranderen.
        </p>
    </section>
    <section class="card explainer" id="einstein">
        <h1>Einstein-veldvergelijking(en)</h1>
        {@html EFE}
        <p>Hierbij is</p>
        <ul>
            <li>{@html einsteinTensor} de einstein-tensor.</li>
            <li>
                {@html katex.renderToString("\\Lambda")} de kosmologische constante
            </li>
            <li>{@html metricTensor} de metrische tensor.</li>
            <li>{@html c} de lichtsnelheid</li>
            <li>{@html gravitationalConstant} de gravitatieconstante</li>
            <li>{@html energyImpulsTensor} de energie-impuls-tensor</li>
        </ul>
    </section>
    <section class="card explainer">
        <h1>Wat is een <i>tensor</i>?</h1>
        <p>
            De Einstein-veldvergelijking is een tensor vergelijking, dat houdt
            in dat het een combinatie is van meerdere vergelijkingen. Er is een
            vergelijking voor elke waarde van {@html q("\\mu")} en {@html q(
                "\\nu",
            )}.
        </p>
        <p>
            Een <i>tensor</i> is zoals veel dingen in de wiskunde, een
            generalisatie van
            <i>scalairen</i>, <i>vectoren</i> en <i>matrices</i>. Een
            <i>scalair</i>
            is "gewoon" een getal. Een <i>vector</i> is dan een geordende reeks van
            getallen, in de natuurkunde vertegenwoordigen vectoren meestal een pijl
            in een bepaald veld. Een matrix is vervolgens een combinatie van vectoren.
            Scalairen, vectoren en matrices zijn elk respectievelijk, rang-0, rang-1
            en rang-2 tensoren.
        </p>
        <p>
            De vergelijkingen vatten samen hoe de kromming van ruimtetijd wordt
            beïnvloed door de aanwezigheid van energie. Maar wat is ruimtetijd?
        </p>

        <!-- <p>
            Meer uitleg van de wiskunde achter de Einstein-veldvergelijkingen en
            de algemene relativiteitstheorie vind je hier:
        </p>
        <a href="./meth">Wiskunde achter Einstein-veldvergelijkingen</a> -->
    </section>
    <section class="card explainer">
        <h1>Ruimtetijd en wereldlijnen</h1>
        <p>
            Ruimtetijd is de structuur van ons universum en heeft 4 dimensies, 3
            ruimtelijke dimensies en 1 voor tijd.
        </p>
        <p>Om te vereenvoudigen worden vanaf nu slechts twee weergeven.</p>
        <p>
            Beeldt een vlak in dat ruimtetijd vertegenwoordigt en vervolgens een
            curve op het vlak. Deze curve beschrijft een object. De curve is de <b
                >wereldlijn</b
            >
            van het object. Om deze wereldlijn te interpreteren, verdeel je de curve
            in kleine gelijkmatig verdeelde intervallen. Vervolgens kies je één punt
            als oorsprong en nummer je de punten één voor één. u is de curve voorzien
            van een progressie. De opeenvolgende punten stellen nu een traject voor.
            De curve representeert de beweging van het object door ruimtetijd. De
            verdeling waarlangs het object beweegt heet de <b>eigentijd</b>
            van het object en wordt aangeduid met de Griekse letter {@html properTime}
            (tau). De eigentijd van het object is de tijd dat zijn interne evolutie
            regeert, oftewel de tijd die voorbij zo gaan op zijn eigen klok.
        </p>
    </section>
    <section class="card explainer">
        <h1>Assenstelsels</h1>
        <p>
            Nu het concept van beweging is bepaald, moet de positie van het
            object worden beschreven naarmate eigentijd verstrijkt. Om een punt
            wiskundig te beschrijven, teken je op het oppervlak een
            assenstelsel. Dit assenstelsel heeft een oorsprong, waaruit de
            gridlijnen worden geteld, op deze manier kan je de positie van het
            object bepalen met twee getallen, zijn coördinaten. Het assenstelsel
            dat gebruikt wordt, is onafhankelijk van de werkelijke positie van
            het object, het is simpelweg een abstract hulpmiddel om punten te
            beschrijven met getallen. Afhankelijk van de situatie zijn sommige
            assenstelsels beter passend dan anderen.
        </p>
    </section>
    <section class="card explainer">
        <h1>Snelheid</h1>
        <p>
            De vectoriële snelheid van het object in ruimtetijd is een vector
            die raakt aan de curve. De lengte van deze vector is de snelheid
            waarmee het object beweegt in ruimte tijd. Deze snelheid is overal
            gelijk, want de intervallen zijn regelmatig verdeeld. In andere
            woorden, voor een gegeven eigentijd, beweegt het object altijd
            dezelfde afstand. Algemener, <i>alle</i> objecten in het universum
            bewegen met deze snelheid (door ruimtetijd), de lichtsnelheid ({@html c}).
            En dus {@html m.vectorNormIsC}
            (de norm van de vector is altijd de lichtsnelheid)
        </p>
        <p>
            Om de snelheid te beschrijven met de coördinaten, teken je startend
            vanaf het object twee pijlen die richting van elk coördinaat
            aangeeft. Deze pijlen heten basisvectoren ({@html katex.renderToString(
                "\\overrightarrow{e_0}, \\overrightarrow{e_1}",
            )}). Met deze twee basisvectoren kan je de snelheidsvector ontbinden
            tot een som van hun veelvouden, een liniaire combinatie.
            {@html m.vectorDecomposed}
        </p>
    </section>
    <section use:renderScene={WorldlineScene} class="card explainer renderer">
        <h1>Wereldlijn</h1>
        <div class="dynamic-value" id="propertime">
            {@html katex.renderToString(`\\tau = 0`)}
        </div>
        <div id="css-renderer"></div>
        <div id="webgl-renderer"></div>
    </section>

    <section class="card explainer">
        <h1>Einstein-notatie</h1>
        <p>
            In de algemene relativiteitstheorie, komt het vaak voor dat meerdere
            gelijksoortige termen worden opgeteld. Om uitdrukkingen korter te
            noteren wordt vaak slechts één term opgeschreven, en wordt het
            index-getal verplaats door een griekse letter. Dit is de
            Einstein-notatie. De ontbonden snelheidsvector wordt dan
            bijvoorbeeld {@html m.einsteinNotationExample}
        </p>
    </section>
    <section class="card explainer">
        <h1>Geodeten</h1>
        <p>
            In ruimte tijd, in de afwezigheid van krachten, bewegen objecten van
            nature in rechte lijnen. Op basis van deze overweging is er een
            methode te bedenken, om het traject van een object te voorspellen.
            Namelijk, zodra we de snelheid weten op een gegeven moment, is de
            beweging op elk ander moment duidelijk. Dit soort traject noemen we
            een <i>geodeet</i>
            Op een geodeet, verandert de vector niet van richting In andere woorden,
            de afgeleide van de vector ten opzichte van eigentijd is nul.
            {@html m.dvdtauIsZero}
        </p>
    </section>
    <section class="card explainer">
        <h1>Geodeten</h1>
        <p>
            De beweging van objecten is van nature niet versnellend, en dus
            wanneer er geen krachten op objecten werkt, bewegen ze in een rechte
            lijn. Eerder zag je al een uitdrukking waarin snelheid werd
            ontbonden in factoren met betrekking tot de basisvectoren. Als je de
            snelheid in de bovenstaande formule vervangt door die uitdrukking
            krijg je
            {@html m.dvdtauFactors1}
            De afgeleide van een product is de som van elke term vermenigvuldigd
            met de afgeleide van de andere term. En dus krijg je
            {@html m.dvdtauFactors2}
            Je krijgt een relatie tussen de verandering in de componenten van snelheid,
            en de verandering van de basisvectoren zelf. De basisvectoren kunnen
            wel degelijk veranderen door het traject, want het grid dat wordt gekozen
            als assenstelsel hoeft niet per se regelmatig te zijn. Hoewel de vector
            zelf niet veranderd, kunnen zijn componenten op het grid wel veranderen
            terwijl het object beweegt.
        </p>
    </section>
    <section class="card explainer">
        <h1>Geodeten</h1>
        <p>
            De evolutie van een basisvector langs de wereldlijn kan ook worden
            ontbonden, tot de som van zijn verandering langs elk coordinaat,
            vermenigvuldigd met de snelheid van het object.
            {@html m.dedtau}
            Dit is zo omdat hoe sneller het object beweegt, hoe sneller de basisvectoren
            zullen variëren. Voor elk coördinaat geeft dit een nieuwe hoeveelheid
            dat aangeeft hoe een basisvector verandert ten opzichte van dat coördinaat.
            Deze verandering wordt ook uitgedrukt als een vector en is de afgeleide
            van een basisvector ten opzichte van een bepaalde coördinaat. Dit is
            een speciale vector, want het hangt niet meer af van het traject van
            een object, maar alleen maar van de structuur van het assenstelsel zelf.
        </p>
    </section>
    <section class="card explainer">
        <h1>Christoffel-symbolen</h1>
        <p>
            Deze vector kan natuurlijk ook weer worden ontbonden tot zijn
            componenten, aangeduid met {@html m.Gamma}. In 2 dimensies bestaan
            er wel 8 van deze componenten, 2 componenten voor 4 verschillende
            vectoren. De getallen heten christoffel symbolen en zijn erg
            belangrijk in de algemene relativiteitstheorie, want ze vertellen
            hoe het grid verandert in elke richting. Als we de vorige
            vergelijking herschrijven met christoffel symbolen, krijgen we de
            geodetische vergelijking.
            {@html m.geodesicEquation}
            Met deze vergelijking kunnen voor elk component van de snelheid, zijn
            mate van verandering, naarmate eigentijd voorbij gaat. De vergelijking
            maakt mogelijk om het volledige traject van een object te voorspellen,
            mits we zijn snelheid weten op een bepaald moment en de waarde van alle
            christoffel symbolen op elk punt in het grid.
        </p>
        <p>
            Zie <a href="./christoffel">hier</a> een interactieve animatie van hoe
            christoffel symbolen veranderen door een grid
        </p>
    </section>
    <section use:renderScene={ChristoffelScene} class="card explainer renderer">
        <h1>Christoffel Symbolen</h1>
        <div id="css-renderer"></div>
        <div id="webgl-renderer"></div>
    </section>
    <!-- <section class="card explainer">
        <p>
            Hoewel wel met ons assenstelsel punten kunnen plaatsen, geeft het
            geen informatie over de aftstand en hoeken tussen deze punten. De
            intervallen op het grid staan niet overal voor dezelfde aftstand of
            oriëntatie. Stel je hebt twee punten, je weet hun coördinaten en je
            wilt de afstand tussen de punten bepalen. In eerste instantie, zo je
            misschien denken aan de stelling van pythagoras. Echter, de stelling
            van pythagoras werkt alleen in een orthogonaal coördinatensysteem.
            Als de assen van het grid elkaar niet overal loodrecht snijden, is
            de stelling van pythagoras niet langer van toepassing. Er moet dus
            een algemenere formule worden gevonden dat werkt ongeacht van het
            grid dat wordt gebruikt. In het algemeen, het kwadraat van de
            afstand kan altijd worden geschreven als een som van alle mogelijke
            combinaties van producten, vermenigvuldigd met bepaalde
            coëfficienten. Deze coëfficienten hangen af van de vorm van het
            grid. In het speciale geval waar de gridlijnen vierkanten vormen van
            lengte 1, zijn deze coëfficienten respectievelijk 1, 0, 0, en 1. En
            de formule valt terug naar de stelling van pythagoras. De
            coëfficienten kunnen worden samengebracht tot een tabel, met één rij
            en één kolom voor elk coördinaat. Dit tabel is een metrische tensor,
            een tabel waarmee we kleine afstanden kunnen bepalen en wordt
            meestal aangeduid met {@html katex.renderToString("g")}. Zijn
            componenten worden genummerd met twee indexen En dus kan het
            kwadraat van de afstand worden geschreven als de som van elk
            componennt van dit tabel, vermenigvuldigd met hun overeenkomstige
            verschillen tussen 2 punten. Met deze formule kunnen we ook de norm
            van de snelheidsvector uitdrukken. De veschillen van de coördinaten
            worden vervangen door de componenten van de snelheid. Met in
            gedachten dat de norm van de snelheid altijd de lichtsnelheid is,
            kunnen we een preciesere vorm van deze formule schrijven. Met de
            metrische tensor kunnen we ook de waarde van de christoffel-symbolen
            bepalen. De metrische tensor beschrijft de vorm van het grid, en de
            vorm van het grid is rechstreeks verwant aan hoe de basis vectoren
            veranderen. Dus door te meten hoe de metrische tensor verandert over
            het grid, kunnen we ook bepalen hoe de basisvectoren veranderen en
            dus ook de waarde van de christoffelsymbolen. Wanneer we deze
            berekening doen, krijgen we een uitdrukking dat afgeleiden van de
            metrische tensor betrekt. Meestal kan deze vergelijking worden
            versimpeld, door een geschikt coördinaten systeem te gebruiken Maar
            nu mist er weer een manier om de metrische tensor te bepalen. De
            kracht van deze abstracte modellen ligt in het feit dat het geen
            aannames maakt over de geometrie van ruimtetijd. Voorheen was
            ruimtetijd weergegeven als een plat vlak, maar niets houdt ons tegen
            om een gebogen vlak in te beelden. Ruimtetijd is namelijk niet
            altijd plat, zijn geometrie kan gebogen worden en zijn buiging heeft
            interessante gevolgen voor banen van objecten. Als ruimteijd
            bijvoorbeeld is gebogen als een bol, zullen twee parallele geodeten
            startend vanaf de evenaar dichter bij elkaar komen. De kromming van
            een oppervlak is een belangrijk concept in de algemene
            relativiteitstheorie, en zal nader gedefinieerd worden.
        </p>
    </section> -->
</div>
