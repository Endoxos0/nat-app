import { Vector3, OrthographicCamera, Scene, WebGLRenderer, Color, SphereGeometry, MeshBasicMaterial, Mesh } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import katex from "katex";
import { perlinCurve, Noise, perlinCurveP, perlinCurveSampler } from "$lib/perlinNoise";
import { findParameterForPoint, perlinGridLine, perlinGridLineP } from "$lib/gridBasisVectors";
import { curveMesh, loopCurve, loopCurveP } from "$lib/curves";
import { limitDifference, minimalDifference, normalizeDeviceSpace, vectorMesh } from "$lib/Vector";

let camera: OrthographicCamera, scene: Scene, renderer: WebGLRenderer;
const frustumSize = 50;

export const symbols: [HTMLDivElement, number][] = [];
let n = 16;
let I: number;
let properTime: number;


let symbolUpdate: () => void;
let loop: (() => void)[] = [];

export function init() {
    //#region Camera Setup
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const aspect = window.innerWidth / window.innerHeight;
    camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
    camera.position.set(
        -2.4517250746012427,
        6.920649464598646,
        6.7892308214349395
    );
    camera.position.set(0, 10, 0);
    camera.zoom = 4.1;
    camera.updateProjectionMatrix();
    scene = new Scene();
    const onWindowResize = () => {
        const aspect = window.innerWidth / window.innerHeight;

        camera.left = - frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = - frustumSize / 2;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);
    //#endregion

    const dragControls = new DragControls([], camera, canvas);

    let perlin = new Noise();
    //#region Generate Grid Lines
    let s = 40;
    let shift = .5;
    let stretch = .1;
    let c = new Color("#2b2b2b");
    for (let i = -s; i < s; i++) {
        let gridline = curveMesh({
            samples: perlinCurve({
                N: 30,
                delta: 0.1,
                ySample: stretch * i,
                shift: shift * i,
                perlin,
            }),
            color: c,
            lineWidth: 0.005
        });
        scene.add(gridline);

        let curvemeshP = curveMesh({
            samples: perlinCurveP({
                N: 30,
                delta: 0.1,
                ySample: stretch * i,
                shift: shift * i,
                perlin,
            }),
            color: c,
            lineWidth: 0.005
        });
        scene.add(curvemeshP);
    }
    //#endregion

    let worldLineMesh = curveMesh({ samples: perlinCurve({ N: 30, delta: 0.1, amplitude: 1 }) });
    scene.add(worldLineMesh);

    //symbols
    (() => {
        let n = 16;
        let shift = 5;
        I = Math.round(worldLineMesh.geometry.points.length / (2 * 3 * n)) * (3 * n) - 3 * n * shift;
        for (let i = 0; i < worldLineMesh.geometry.points.length; i += 3 * n) {
            const geometry = new SphereGeometry(.1, 32, 32);
            const material = new MeshBasicMaterial({ color: 'white' });
            const mesh = new Mesh(geometry, material);
            mesh.position.set(worldLineMesh.geometry.points[i], worldLineMesh.geometry.points[i + 1], worldLineMesh.geometry.points[i + 2]);
            scene.add(mesh);

            camera.updateMatrixWorld(true);
            let screenspace = normalizeDeviceSpace((new Vector3(worldLineMesh.geometry.points[i], worldLineMesh.geometry.points[i + 1], worldLineMesh.geometry.points[i + 2])).project(camera), window.innerWidth, window.innerHeight);
            var symbol: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            symbol.style.position = "absolute";
            symbol.style.left = screenspace.x + 'px';
            symbol.style.top = screenspace.y + 'px';
            symbol.id = ((i - I) / (3 * n)).toString();
            symbol.innerHTML = katex.renderToString(`${ symbol.id }`);
            symbol.className = "symbol";
            document.body.appendChild(symbol);
            symbols.push([symbol, i]);

            symbolUpdate = () => {
                for (let [symbol, i] of symbols) {
                    camera.updateMatrixWorld(true);
                    let screenspace = normalizeDeviceSpace((new Vector3(worldLineMesh.geometry.points[i], worldLineMesh.geometry.points[i + 1], worldLineMesh.geometry.points[i + 2])).project(camera), window.innerWidth, window.innerHeight);
                    if (screenspace.x == 0)
                        symbol.style.visibility = 'hidden';
                    else
                        symbol.style.visibility = 'visible';
                    symbol.style.left = screenspace.x - 5.5 + 'px';
                    symbol.style.top = screenspace.y - 30 + 'px';
                }
            };
        }
    })();

    //drag
    // const geometry = new SphereGeometry(.1, 32, 32);
    // const material = new MeshBasicMaterial({ color: 'red' });
    // const parameterSphere = new Mesh(geometry, material);
    const parameterSphere = curveMesh({ samples: loopCurve({ radius: .25 }) });
    parameterSphere.position.setY(.05);
    scene.add(parameterSphere);
    loop.push(() => {
        // parameterSphere.lookAt(camera.position);
    });

    parameterSphere.position.set(worldLineMesh.geometry.points[I], worldLineMesh.geometry.points[I + 1], worldLineMesh.geometry.points[I + 2]);
    dragControls.objects.push(parameterSphere);

    let tangentScale = 3;
    let velocityMesh = vectorMesh(parameterSphere.position, limitDifference(I, worldLineMesh.geometry.points).normalize().multiplyScalar(tangentScale), 0x00FF00);
    scene.add(velocityMesh.group);

    dragControls.addEventListener('drag', function (event) {
        let { minV, curveIndex } = minimalDifference(parameterSphere.position, worldLineMesh.geometry.points);
        parameterSphere.position.add(minV);
        parameterSphere.position.setY(.05);

        let properTimeNode = (document.getElementById("propertime") as HTMLElement);
        properTime = ((curveIndex - I) / (3 * n));
        properTimeNode.innerHTML = katex.renderToString(`\\tau =${ properTime }`);

        velocityMesh.parameterChange(parameterSphere.position, limitDifference(curveIndex, worldLineMesh.geometry.points).normalize().multiplyScalar(tangentScale));
    });

    let gridcurveX = curveMesh({ samples: perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin }), color: 0x575757 });
    let gridcurveY = curveMesh({ samples: perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin }), color: 0x575757 });
    scene.add(gridcurveX);
    scene.add(gridcurveY);

    //#region User Parameter
    let w = 2;
    let b1 = perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin });
    let b2 = perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin });
    let basis1Mesh = vectorMesh(parameterSphere.position, limitDifference(minimalDifference(parameterSphere.position, b1).curveIndex, b1).normalize().multiplyScalar(w), 0x808080);
    let basis2Mesh = vectorMesh(parameterSphere.position, limitDifference(minimalDifference(parameterSphere.position, b2).curveIndex, b2).normalize().multiplyScalar(-w), 0x808080);
    // scene.add(basis1Mesh.group);
    // scene.add(basis2Mesh.group);
    dragControls.addEventListener('drag', (event) => {
        gridcurveX.geometry.setPoints(perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin }));
        gridcurveY.geometry.setPoints(perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin }));

        velocityMesh.parameterChange(
            parameterSphere.position,
            limitDifference(minimalDifference(parameterSphere.position, worldLineMesh.geometry.points).curveIndex,
                worldLineMesh.geometry.points).normalize().multiplyScalar(tangentScale));

        b1 = perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin });
        b2 = perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin });
        basis1Mesh.parameterChange(
            parameterSphere.position,
            limitDifference(
                minimalDifference(parameterSphere.position, b1).curveIndex,
                b1).normalize().multiplyScalar(w));
        basis2Mesh.parameterChange(
            parameterSphere.position,
            limitDifference(
                minimalDifference(parameterSphere.position, b2).curveIndex,
                b2).normalize().multiplyScalar(-w));
    });

    dragControls.addEventListener('dragstart', (event) => controls.enabled = false);
    dragControls.addEventListener('dragend', (event) => controls.enabled = true);

    const hoverScale = 1.5;
    const inverseHoverScale = 1 / hoverScale;
    dragControls.addEventListener('hoveron', (event) => parameterSphere.geometry.scale(hoverScale, hoverScale, hoverScale));
    dragControls.addEventListener('hoveroff', (event) => parameterSphere.geometry.scale(inverseHoverScale, inverseHoverScale, inverseHoverScale));
    //#endregion

    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(render);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 1;

}

function render() {
    // console.log([...camera.position]);

    for (let el of document.getElementsByClassName("symbol"))
        (el as HTMLDivElement).style.visibility = "hidden";
    symbolUpdate();
    loop.forEach((fn) => fn());

    renderer.render(scene, camera);
}