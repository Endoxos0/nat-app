import { OrthographicCamera, Scene, WebGLRenderer, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, TubeGeometry } from "three";
import katex from "katex";
import { Noise } from "$lib/perlinNoise";
import { closestPointToPoint, PerlinCurve, PerlinCurveAtPoint } from "$lib/curves";
import { decompose, Vector } from "$lib/Vector";
import { CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { symbolOf } from "$lib/symbol";
import { CurveParameter } from "$lib/parameter";

let camera: OrthographicCamera, scene: Scene, rendererGl: WebGLRenderer, rendererCss: CSS3DRenderer;
let controlsGl: OrbitControls;

export function init() {
    //#region Scene Setup
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
    (document.querySelector('#css-renderer') as HTMLDivElement).appendChild(rendererCss.domElement);

    rendererGl = new WebGLRenderer({ antialias: true, alpha: true });
    rendererGl.setClearColor(0x000000, 0.0);
    rendererGl.setSize(window.innerWidth, window.innerHeight);
    rendererGl.setPixelRatio(window.devicePixelRatio);
    rendererGl.setAnimationLoop(animate);
    rendererGl.shadowMap.enabled = true;
    rendererGl.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    (document.querySelector('#webgl-renderer') as HTMLDivElement).appendChild(rendererGl.domElement);

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
    dragControls.addEventListener('dragstart', (event) => controlsGl.enabled = false);
    dragControls.addEventListener('dragend', (event) => controlsGl.enabled = true);
    const hoverScale = 1.5;
    dragControls.addEventListener('hoveron', (event) => event.object.scale.multiplyScalar(hoverScale));
    dragControls.addEventListener('hoveroff', (event) => event.object.scale.divideScalar(hoverScale));
    const mat0 = new MeshBasicMaterial({ color: 0xFFFFFF });
    const mat1 = new MeshBasicMaterial({ color: 0x2B2B2B });

    let perlin = new Noise();
    let perlinX1 = new Noise();
    let gridSize = 40;
    let coord_shift = .5;
    let stretch = .1;
    for (let i = -gridSize; i < gridSize; i++) {
        const x0 = new PerlinCurve({ start: -20, end: 20, ySample: stretch * i, shift: coord_shift * i, perlin });
        const x0_geometry = new TubeGeometry(x0, 1000, 0.01, 15, false);
        const x0_mesh = new Mesh(x0_geometry, mat1);
        scene.add(x0_mesh);
        const x1 = new PerlinCurve({ start: -20, end: 20, ySample: stretch * i, shift: coord_shift * i, perlin: perlinX1, theta: Math.PI / 3 });
        const x1_geometry = new TubeGeometry(x1, 1000, 0.01, 15, false);
        const x1_mesh = new Mesh(x1_geometry, mat1);
        scene.add(x1_mesh);
    }

    const worldline = new PerlinCurve({ amplitude: 1, start: -20, end: 20 });
    const curve_geometry = new TubeGeometry(worldline, 1000, 0.01, 15, false);
    const mesh = new Mesh(curve_geometry, mat0);
    scene.add(mesh);

    let interval = [-10, 10];
    let N = Math.abs(interval[0]) + Math.abs(interval[1]);
    for (let i = interval[0]; i <= interval[1]; i++) {
        const point = worldline.getPointAt((i + Math.abs(interval[0])) / N);
        const offset = new Vector3(0, 0, -.5);

        const geometry = new SphereGeometry(.1, 32, 32);
        const material = new MeshBasicMaterial({ color: 'white' });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(point);
        scene.add(mesh);

        point.add(offset);
        let symbol = symbolOf({ c: (i).toString() });
        symbol.rotateX(-Math.PI / 2);
        symbol.position.copy(point);
        scene.add(symbol);
    }

    let properTime: number = 0;
    let properTimeNode = (document.getElementById("propertime") as HTMLElement);
    let T = Math.abs(interval[0]) / N;
    const parameterSphere = new CurveParameter(.25);
    dragControls.objects.push(parameterSphere);
    parameterSphere.position.copy(worldline.getPointAt(T));
    scene.add(parameterSphere);
    dragControls.addEventListener('drag', function (event) {
        (event.object as CurveParameter).restrictToCurve(worldline);
        T = (event.object as CurveParameter).T;
        properTime = interval[0] + (event.object as CurveParameter).T * (interval[1] - interval[0]);
        properTimeNode.innerHTML = katex.renderToString(`\\tau =${ properTime.toFixed(2) }`);
    });

    let x0 = new PerlinCurveAtPoint({ start: -20, end: 20, point: parameterSphere.position, stretch, shift: coord_shift, perlin });
    let x1 = new PerlinCurveAtPoint({ start: -20, end: 20, point: parameterSphere.position, stretch, shift: coord_shift, perlin: perlinX1, theta: Math.PI / 3 });
    const x0_geometry = new TubeGeometry(x0, 1000, 0.01, 15, false);
    const x1_geometry = new TubeGeometry(x1, 1000, 0.01, 15, false);
    const x0_mesh = new Mesh(x0_geometry, mat0);
    const x1_mesh = new Mesh(x1_geometry, mat0);
    x0_mesh.position.setY(.01);
    x1_mesh.position.setY(.01);
    // scene.add(x0_mesh);
    // scene.add(x1_mesh);
    let [P_e0, T_e0] = closestPointToPoint(parameterSphere.position, x0, 0.0001);
    let [P_e1, T_e1] = closestPointToPoint(parameterSphere.position, x1, 0.0001);
    let v = new Vector(parameterSphere.position, worldline.getTangentAt(T).normalize().multiplyScalar(4), '\\overrightarrow{v}', 0x00FF00);
    let e0 = new Vector(parameterSphere.position, x0.getTangentAt(T_e0).normalize(), '\\overrightarrow{e_0}', 0x808080);
    let e1 = new Vector(parameterSphere.position, x1.getTangentAt(T_e1).normalize(), '\\overrightarrow{e_1}', 0x808080);
    let ve = decompose(v.vector, e0.vector, undefined, e1.vector);
    let v0e0 = new Vector(parameterSphere.position, x0.getTangentAt(T_e0).normalize().multiplyScalar(ve.x), 'v^0\\overrightarrow{e_0}', 0x808080);
    let v1e1 = new Vector(parameterSphere.position, x1.getTangentAt(T_e1).normalize().multiplyScalar(ve.z), 'v^1\\overrightarrow{e_1}', 0x808080);
    scene.add(v);
    scene.add(e0);
    scene.add(e1);
    scene.add(v0e0);
    scene.add(v1e1);
    dragControls.addEventListener('drag', (event) => {
        x0.point = event.object.position;
        x1.point = event.object.position;
        x0_mesh.geometry = new TubeGeometry(x0, 1000, 0.01, 15, false);
        x1_mesh.geometry = new TubeGeometry(x1, 1000, 0.01, 15, false);

        [P_e0, T_e0] = closestPointToPoint(parameterSphere.position, x0, 0.0001);
        [P_e1, T_e1] = closestPointToPoint(parameterSphere.position, x1, 0.0001);
        v.setVector(parameterSphere.position, worldline.getTangentAt(T).normalize().multiplyScalar(4));
        e0.setVector(parameterSphere.position, x0.getTangentAt(T_e0).normalize());
        e1.setVector(parameterSphere.position, x1.getTangentAt(T_e1).normalize());
        ve = decompose(v.vector, e0.vector, undefined, e1.vector);
        v0e0.setVector(parameterSphere.position, x0.getTangentAt(T_e0).normalize().multiplyScalar(ve.x));
        v1e1.setVector(parameterSphere.position, x1.getTangentAt(T_e1).normalize().multiplyScalar(ve.z));
    });
}

function animate() {
    controlsGl.update();
    rendererGl.render(scene, camera);
    rendererCss.render(scene, camera);
}

export function cleanup() {
    console.clear();
    if (rendererCss.domElement)
        rendererCss.domElement.remove();
    if (rendererGl.domElement)
        rendererGl.domElement.remove();
}