<script>
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
    } from "./math";
    import "katex/dist/katex.min.css";
    import "./app.css";
    const eq = katex.renderToString;
</script>

<div class="container">
    <div class="righthalf">
        <h3>Overzicht + Geschiedenis:</h3>
        <h3>Donkere materie, Donkere energie</h3>
        <iframe
            width="1519"
            height="607"
            src="https://www.youtube.com/embed/j1_MrnDEL1M"
            title="voorstel natuurkunde"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        ></iframe>
    </div>

    <div class="half">
        <h1>Donkere Materie</h1>
        <p>
            Donkere materie is een hypothetische vorm van materie dat niet wordt
            beïnvloed door licht of electromagnetische straling. Zijn bestaan
            wordt gesuggereerd door zwaartekrachteffecten, onverklaarbaar door
            de algemene relativiteitstheorie, tenzij er meer materie is dan wat
            wordt waargenomen. Deze effecten treden op in meerdere contexten:
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
            slechts de ruimtetijd. De Einstein-Vergelijking vat samen hoe
            objecten ruimtijd veranderen.
        </p>

        <h2>Einstein-Vergelijking</h2>
        {@html EFE}
        <p>Hierbij is</p>
        <ul>
            <li>{@html einsteinTensor} de einstein-tensor.</li>
            <li>{@html metricTensor} de metrische tensor.</li>
            <li>{@html ricciTensor} de ricci-tensor</li>
            <li>{@html scalarCurvature} de scalaire kromming</li>
            <li>{@html energyImpulsTensor} de energie-impuls-tensor</li>
            <li>{@html c} de lichtsnelheid</li>
            <li>{@html gravitationalConstant} de gravitatieconstante</li>
        </ul>
        <h3>Wat is een <i>tensor</i>?</h3>
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
        <h2><a href="./worldline">Worldlines</a></h2>
        <p></p>
    </div>
</div>

<!-- <h2>Afleiding</h2>
<p>
    De fundamentele aannames waarop deze afleiding van de
    Einstein-veldvergelijkingen berust op:
</p>

<ul>
    <li>
        <b>De vergijkingen moeten <i>tensor-vergelijkingen</i> zijn</b>; De
        natuurkundige wetten moeten onafhankelijk zijn van wat voor coördinaten
        er gebruikt worden.
    </li>
    <li>De vergijkingen brengen kormming van ruimte in verband met materie</li>
    <li>
        Tot een bepaald limiet zijn de vergelijking bij benadering gelijk aan
        die van Newtoniaanse zwaartekracht.
    </li>
    <li>
        De veldvergelijkingen moeten voldoen aan de (lokale) behoudswetten van
        energie en impuls.
    </li>
</ul>
<h3>(1) Veronderstel een relatie tussen kromming en materie</h3>
<p>
    Deze afleiding van de Einsteinvergelijking berust vooral op een
    generalisatie van Poissons vergelijking, een veldvergelijking van
    Newtoniaanse zwaartekracht. Deze vergelijking brengt Newtoniaans
    gravitatiepotentieel ({@html eq("\\Phi")}) in verband met massa/energie
    -dichtheid ({@html eq("\\rho")}).
</p>
{@html Poissons} (Poissons vergelijking)
<p>
    Hierbij is {@html Laplacian} de Laplace-operator, het vertegenwoordigt divergentie
    van de gradiënt. Volledig uitgeschreven (in 3 dimensies) is het: {@html LaplacianFull}.
    Maar voor alle praktische doeleinden verschilt het niet veel van zijn
    1-dimensionale analoog, de tweede afgeleide. Beide meten kromming van een
    functie in een bepaald punt.
</p>
<p>
    Merk op dat in zowel Poissons vergelijking en de Einstein-Vergelijking, de
    rechterhand van de vergelijking gaat over energie en materie.
</p>
<p>
    De linkerhand van de vergelijking moet gaan of de kromming van ruimtetijd.
</p> -->

<!-- {@html html} -->
