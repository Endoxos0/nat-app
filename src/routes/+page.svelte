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
    } from "$lib/math";
    import "katex/dist/katex.min.css";
    import "$lib/index.css";
    const eq = katex.renderToString;
</script>

<div class="cards">
    <section class="card title center">
        <div>
            <h1>Dark Matter</h1>
            <div class="horizontal-align">
                <h2>
                    + dark energy, Keplers third law and gravitational lensing
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
    <section class="card explainer">
        <h1>Einstein-Vergelijking</h1>
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
    </section>
    <section class="card explainer">
        <h1>Wat is een <i>tensor</i>?</h1>
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
            Meer uitleg van de wiskunde achter de Einstein-veldvergelijkingen en
            de algemene relativiteitstheorie vind je hier:
        </p>
        <a href="./meth">Wiskunde achter Einstein-veldvergelijkingen</a>
    </section>
</div>
