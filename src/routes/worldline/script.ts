import { OrthographicCamera, Scene, WebGLRenderer, Color, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, TubeGeometry } from "three";
import katex, { render } from "katex";
import { perlinCurve, Noise, perlinCurveP, perlinCurveRising } from "$lib/perlinNoise";
import { perlinGridLine, perlinGridLineP } from "$lib/gridBasisVectors";
import { curveMesh, loopCurve, PerlinCurve } from "$lib/curves";
import { decompose, limitDifference, minimalDifference, vectorMesh } from "$lib/Vector";
import { CSS3DObject, CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { symbolOf } from "$lib/symbol";

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
    camera.position.set(-2.4517250746012427, 6.920649464598646, 6.7892308214349395);

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
    let properTime: number;

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

    let worldLineMesh = curveMesh({ samples: perlinCurveRising({ N: 30, delta: 0.1, amplitude: 2 }) });
    scene.add(worldLineMesh);

    //#region symbols
    let symbolShift = 5;
    I = Math.round(worldLineMesh.geometry.points.length / (2 * 3 * n)) * (3 * n) - 3 * n * symbolShift;

    for (let i = 0; i < worldLineMesh.geometry.points.length; i += 3 * n) {
        const point: Vector3 = new Vector3(worldLineMesh.geometry.points[i], worldLineMesh.geometry.points[i + 1], worldLineMesh.geometry.points[i + 2]);
        const offset: Vector3 = new Vector3(0, 0, -.5);

        const geometry = new SphereGeometry(.1, 32, 32);
        const material = new MeshBasicMaterial({ color: 'white' });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(point.x, point.y, point.z);
        scene.add(mesh);

        point.add(offset);
        let s = symbolOf({ c: ((i - I) / (3 * n)).toString() });
        s.rotateX(-Math.PI / 2);
        s.position.set(point.x, point.y, point.z);
        // camera.updateMatrixWorld();
        // s.lookAt(camera.position);
        scene.add(s);
    }

    //drag
    // const geometry = new SphereGeometry(.1, 32, 32);
    // const material = new MeshBasicMaterial({ color: 'red' });
    // const parameterSphere = new Mesh(geometry, material);
    const parameterSphere = curveMesh({ samples: loopCurve({ radius: .25 }) });
    parameterSphere.position.setY(.05);
    scene.add(parameterSphere);

    parameterSphere.position.set(worldLineMesh.geometry.points[I], worldLineMesh.geometry.points[I + 1], worldLineMesh.geometry.points[I + 2]);
    dragControls.objects.push(parameterSphere);


    dragControls.addEventListener('drag', function (event) {
        let { minV, curveIndex } = minimalDifference(parameterSphere.position, worldLineMesh.geometry.points);
        parameterSphere.position.add(minV);
        parameterSphere.position.setY(.05);

        let properTimeNode = (document.getElementById("propertime") as HTMLElement);
        properTime = ((curveIndex - I) / (3 * n));
        properTimeNode.innerHTML = katex.renderToString(`\\tau =${ properTime }`);
    });

    let gridcurveX = curveMesh({ samples: perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin }), color: 0x575757 });
    let gridcurveY = curveMesh({ samples: perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin }), color: 0x575757 });
    // scene.add(gridcurveX);
    // scene.add(gridcurveY);

    //#region User Parameter
    let tangentScale = 5;
    let coord1 = perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin });
    let coord2 = perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin });
    let v = limitDifference(I, worldLineMesh.geometry.points).normalize().multiplyScalar(tangentScale);
    let e0 = limitDifference(minimalDifference(parameterSphere.position, coord1).curveIndex, coord1).normalize();
    let e1 = limitDifference(minimalDifference(parameterSphere.position, coord2).curveIndex, coord2).normalize().multiplyScalar(-1);
    let ve = decompose(v, e0, undefined, e1);
    let v0e0 = e0.clone().multiplyScalar(ve.x);
    let v1e1 = e1.clone().multiplyScalar(ve.z);;
    let vMesh = vectorMesh(parameterSphere.position, v, 0x00FF00);
    let e0Mesh = vectorMesh(parameterSphere.position, e0, 0x808080, "\\overrightarrow{e_0}");
    let e1Mesh = vectorMesh(parameterSphere.position, e1, 0x808080, "\\overrightarrow{e_1}");
    let v0e0Mesh = vectorMesh(parameterSphere.position, v0e0, 0x808080, "v^0\\overrightarrow{e_0}");
    let v1e1Mesh = vectorMesh(parameterSphere.position, v1e1, 0x808080, "v^1\\overrightarrow{e_1}");
    scene.add(e0Mesh.group);
    scene.add(e1Mesh.group);
    scene.add(v0e0Mesh.group);
    scene.add(v1e1Mesh.group);
    scene.add(vMesh.group);
    dragControls.addEventListener('drag', (event) => {
        gridcurveX.geometry.setPoints(perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin }));
        gridcurveY.geometry.setPoints(perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin }));

        v = limitDifference(minimalDifference(parameterSphere.position, worldLineMesh.geometry.points).curveIndex,
            worldLineMesh.geometry.points).normalize().multiplyScalar(tangentScale);
        vMesh.parameterChange(parameterSphere.position, v);

        coord1 = perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin });
        coord2 = perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin });
        e0 = limitDifference(minimalDifference(parameterSphere.position, coord1).curveIndex, coord1).normalize();
        e1 = limitDifference(minimalDifference(parameterSphere.position, coord2).curveIndex, coord2).normalize().multiplyScalar(-1);
        e0Mesh.parameterChange(parameterSphere.position, e0);
        e1Mesh.parameterChange(parameterSphere.position, e1);

        ve = decompose(v, e0, undefined, e1);
        v0e0 = e0.clone().multiplyScalar(ve.x);
        v1e1 = e1.clone().multiplyScalar(ve.z);;
        v0e0Mesh.parameterChange(parameterSphere.position, v0e0);
        v1e1Mesh.parameterChange(parameterSphere.position, v1e1);
    });

    dragControls.addEventListener('dragstart', (event) => controlsGl.enabled = false);
    dragControls.addEventListener('dragend', (event) => controlsGl.enabled = true);

    const hoverScale = 1.5;
    const inverseHoverScale = 1 / hoverScale;
    dragControls.addEventListener('hoveron', (event) => parameterSphere.geometry.scale(hoverScale, hoverScale, hoverScale));
    dragControls.addEventListener('hoveroff', (event) => parameterSphere.geometry.scale(inverseHoverScale, inverseHoverScale, inverseHoverScale));
    //#endregion
}

export function animate() {
    controlsGl.update();
    rendererGl.render(scene, camera);
    rendererCss.render(scene, camera);
}