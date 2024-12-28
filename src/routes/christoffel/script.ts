import { OrthographicCamera, Scene, WebGLRenderer, Color, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, type Object3DEventMap } from "three";
import katex, { render } from "katex";
import { perlinCurve, Noise, perlinCurveP, perlinCurveRising } from "$lib/perlinNoise";
import { perlinGridLine, perlinGridLineP } from "$lib/gridBasisVectors";
import { curveMesh, loopCurve } from "$lib/curves";
import { decompose, limitDifference, minimalDifference, vectorMesh } from "$lib/Vector";
import { CSS3DObject, CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { symbolOf } from "$lib/symbol";
import type { MeshLineGeometry, MeshLineMaterial } from "meshline";

let camera: OrthographicCamera, scene: Scene, rendererGl: WebGLRenderer, rendererCss: CSS3DRenderer;
let controlsGl: OrbitControls;

export function init() {
    //#region Camera Setup
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 50;
    camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
    camera.position.set(0, 10, 0);
    camera.zoom = 4.1;
    camera.updateProjectionMatrix();
    // camera.position.set(-2.4517250746012427, 6.920649464598646, 6.7892308214349395);

    scene = new Scene();

    rendererCss = new CSS3DRenderer();
    rendererCss.setSize(window.innerWidth, window.innerHeight);
    (document.querySelector('#css') as HTMLDivElement).appendChild(rendererCss.domElement);

    rendererGl = new WebGLRenderer({ antialias: true, alpha: true });
    rendererGl.setClearColor(0x000000, 0.0);
    rendererGl.setSize(window.innerWidth, window.innerHeight);
    rendererGl.setPixelRatio(window.devicePixelRatio);
    rendererGl.setAnimationLoop(animate);
    rendererGl.shadowMap.enabled = true;
    rendererGl.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    (document.querySelector('#webgl') as HTMLDivElement).appendChild(rendererGl.domElement);

    controlsGl = new OrbitControls(camera, rendererGl.domElement);
    new OrbitControls(camera, rendererCss.domElement);

    const onWindowResize = () => {
        const aspect = window.innerWidth / window.innerHeight;

        camera.left = - frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = - frustumSize / 2;

        camera.updateProjectionMatrix();

        rendererGl.setSize(window.innerWidth, window.innerHeight);
        rendererCss.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);
    //#endregion

    const dragControls = new DragControls([], camera, rendererGl.domElement);

    let n = 16;
    let I: number;
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

    let axisHighlight = curveMesh({ samples: perlinCurveP({ N: 30, delta: 0.01, perlin }), color: 0x858483 });
    scene.add(axisHighlight);

    //#region symbols
    let parameterShift = 50;
    I = Math.round(axisHighlight.geometry.points.length / (2 * 3 * n)) * (3 * n) - 3 * n * parameterShift;

    //drag
    const p1 = curveMesh({ samples: loopCurve({ radius: .25 }) });
    p1.position.set(-4, .05, 0);
    p1.position.add(minimalDifference(p1.position, axisHighlight.geometry.points).minV);
    dragControls.objects.push(p1);
    scene.add(p1);

    const p2 = curveMesh({ samples: loopCurve({ radius: .25 }) });
    p2.position.set(4, .05, 0);
    p2.position.add(minimalDifference(p2.position, axisHighlight.geometry.points).minV);
    dragControls.objects.push(p2);
    scene.add(p2);

    dragControls.addEventListener('drag', function (event) {
        let { minV, curveIndex } = minimalDifference(event.object.position, axisHighlight.geometry.points);
        event.object.position.add(minV);
        event.object.position.setY(.05);
    });

    // let gridcurveX = curveMesh({ samples: perlinGridLine({ P: p1.position, shift, stretch, perlin }), color: 0x575757 });
    // let gridcurveY = curveMesh({ samples: perlinGridLineP({ P: p1.position, shift, stretch, perlin }), color: 0x575757 });
    // scene.add(gridcurveX);
    // scene.add(gridcurveY);

    //#region User Parameter
    let scale = 5.4;

    let coord1 = perlinGridLine({ P: p1.position, shift, stretch, perlin });
    let coord2 = perlinGridLineP({ P: p1.position, shift, stretch, perlin });
    let coord2B = perlinGridLineP({ P: p2.position, shift, stretch, perlin });
    let e0 = limitDifference(minimalDifference(p1.position, coord1).curveIndex, coord1).normalize();
    let e1 = limitDifference(minimalDifference(p1.position, coord2).curveIndex, coord2).normalize().multiplyScalar(-scale);
    let e1B = limitDifference(minimalDifference(p2.position, coord2B).curveIndex, coord2B).normalize().multiplyScalar(-scale);

    let e0Mesh = vectorMesh(p1.position, e0, 0x808080, "\\overrightarrow{e_0}");
    let e1Mesh = vectorMesh(p1.position, e1, 0xFF0000, "\\overrightarrow{e_1}");
    let e1Mesh2 = vectorMesh(p2.position, e1, 0xFF0000, "\\overrightarrow{e_1}");
    let e1MeshB = vectorMesh(p2.position, e1B, 0x808080, "\\overrightarrow{e_1}");
    let de1dx0 = vectorMesh(p2.position.clone().add(e1B), e1.clone().sub(e1B), 0xFFFFFF, "\\dfrac{\\mathrm{d}\\overrightarrow{e_1}}{\\mathrm{d}x^0}");
    scene.add(e0Mesh.group);
    scene.add(e1Mesh.group);
    scene.add(e1Mesh2.group);
    scene.add(e1MeshB.group);
    scene.add(de1dx0.group);
    dragControls.addEventListener('drag', (event) => {
        // gridcurveX.geometry.setPoints(perlinGridLine({ P: p1.position, shift, stretch, perlin }));
        // gridcurveY.geometry.setPoints(perlinGridLineP({ P: p1.position, shift, stretch, perlin }));
        coord1 = perlinGridLine({ P: p1.position, shift, stretch, perlin });
        coord2 = perlinGridLineP({ P: p1.position, shift, stretch, perlin });
        coord2B = perlinGridLineP({ P: p2.position, shift, stretch, perlin });
        e0 = limitDifference(minimalDifference(p1.position, coord1).curveIndex, coord1).normalize();
        e1 = limitDifference(minimalDifference(p1.position, coord2).curveIndex, coord2).normalize().multiplyScalar(-scale);
        e1B = limitDifference(minimalDifference(p2.position, coord2B).curveIndex, coord2B).normalize().multiplyScalar(-scale);
        e0Mesh.parameterChange(p1.position, e0);
        e1Mesh.parameterChange(p1.position, e1);
        e1Mesh2.parameterChange(p2.position, e1);
        e1MeshB.parameterChange(p2.position, e1B);
        de1dx0.parameterChange(p2.position.clone().add(e1B), e1.clone().sub(e1B));
    });

    dragControls.addEventListener('dragstart', (event) => controlsGl.enabled = false);
    dragControls.addEventListener('dragend', (event) => controlsGl.enabled = true);

    const hoverScale = 1.5;
    const inverseHoverScale = 1 / hoverScale;
    dragControls.addEventListener('hoveron', (event) => (event.object as Mesh<MeshLineGeometry, MeshLineMaterial, Object3DEventMap>).geometry.scale(hoverScale, hoverScale, hoverScale));
    dragControls.addEventListener('hoveroff', (event) => (event.object as Mesh<MeshLineGeometry, MeshLineMaterial, Object3DEventMap>).geometry.scale(inverseHoverScale, inverseHoverScale, inverseHoverScale));
    //#endregion
}

export function animate() {
    controlsGl.update();
    rendererGl.render(scene, camera);
    rendererCss.render(scene, camera);
}