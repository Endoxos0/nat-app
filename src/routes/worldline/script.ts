import { OrthographicCamera, Scene, WebGLRenderer, DirectionalLight, Color, SphereGeometry, MeshBasicMaterial, Mesh } from "three";
import { Vector3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { findClosestPointOnCurve, generateFlowingCurve2D, generateFlowingCurve3D, noiseCurveMesh, normalizeDeviceSpace, splitArray } from "./curve";
import { DragControls } from 'three/addons/controls/DragControls.js';
import katex from "katex";
import { tangentVector, vectorMesh } from "./line";

let camera: OrthographicCamera, scene: Scene, renderer: WebGLRenderer;
const frustumSize = 50;

let curve: number[];
export const symbols: [HTMLDivElement, number][] = [];
let n = 16;
let I: number;

export function init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const aspect = window.innerWidth / window.innerHeight;
    camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
    camera.position.set(
        -1.0758422432724446,
        9.157376072449832,
        3.8710498492416723
    );
    camera.zoom = 3;
    camera.updateProjectionMatrix();
    scene = new Scene();

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    let [noiseLineMesh, Curve] = noiseCurveMesh();
    curve = Curve;
    scene.add(noiseLineMesh);

    (() => {
        let N = 10;
        for (let i = -N; i < N; i++) {
            let [mz, cz] = noiseCurveMesh(new Color('white'), .1, .01, 125);
            mz.position.setZ(2.5 * i);
            scene.add(mz);

            let [my, cy] = noiseCurveMesh(new Color('white'), .1, .01, 125);
            my.rotateY(Math.PI * 0.5);
            my.position.setX(2.5 * i);
            scene.add(my);
        };
    })();

    (() => {
        let n = 16;
        let shift = 5;
        I = Math.round(curve.length / (2 * 3 * n)) * (3 * n) - 3 * n * shift;
        for (let i = 0; i < curve.length; i += 3 * n) {
            const geometry = new SphereGeometry(.1, 32, 32);
            const material = new MeshBasicMaterial({ color: 'white' });
            const mesh = new Mesh(geometry, material);
            mesh.position.set(curve[i], curve[i + 1], curve[i + 2]);
            scene.add(mesh);

            camera.updateMatrixWorld(true);
            let screenspace = normalizeDeviceSpace((new Vector3(curve[i], curve[i + 1], curve[i + 2])).project(camera), window.innerWidth, window.innerHeight);
            var symbol: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            symbol.style.position = "absolute";
            symbol.style.left = screenspace.x + 'px';
            symbol.style.top = screenspace.y + 'px';
            symbol.id = ((i - I) / (3 * n)).toString();
            symbol.innerHTML = katex.renderToString(`${ symbol.id }`);
            symbol.className = "symbol";
            document.body.appendChild(symbol);
            symbols.push([symbol, i]);
        }
    })();

    (() => {
        const geometry = new SphereGeometry(.1, 32, 32);
        const material = new MeshBasicMaterial({ color: 'red' });
        const mesh = new Mesh(geometry, material);
        const hoverScale = 1.5;
        const inverseHoverScale = 1 / hoverScale;
        scene.add(mesh);

        let tangentScale = 5;
        let A = new Vector3(curve[I], curve[I + 1], curve[I + 2]);
        let R = new Vector3(curve[I + 3] - curve[I], curve[I + 4] - curve[I + 1], curve[I + 5] - curve[I + 2]);
        const TangentVector = vectorMesh(...tangentVector(A, R.normalize(), tangentScale));
        scene.add(TangentVector.line);
        scene.add(TangentVector.cone);

        mesh.position.set(curve[I], curve[I + 1], curve[I + 2]);
        const dragControls = new DragControls([mesh], camera, canvas);
        dragControls.addEventListener('dragstart', (event) => {
            controls.enabled = false;
        });
        dragControls.addEventListener('dragend', function (event) {
            controls.enabled = true;
        });
        dragControls.addEventListener('drag', function (event) {
            let closestPoint = findClosestPointOnCurve([event.object.position.x, event.object.position.y, event.object.position.z], curve);
            event.object.position.set(...closestPoint.p);
            let properTimeNode = (document.getElementById("propertime") as HTMLElement);
            properTimeNode.innerHTML = katex.renderToString(`\\tau =${ ((closestPoint.i - I) / (3 * n)) }`);

            let a = new Vector3(curve[closestPoint.i], curve[closestPoint.i + 1], curve[closestPoint.i + 2]);
            let r = new Vector3(curve[closestPoint.i + 3] - curve[closestPoint.i], curve[closestPoint.i + 4] - curve[closestPoint.i + 1], curve[closestPoint.i + 5] - curve[closestPoint.i + 2]);
            TangentVector.parameterChange(...tangentVector(a, r.normalize(), tangentScale));
        });
        dragControls.addEventListener('hoveron', function (event) {
            mesh.geometry.scale(hoverScale, hoverScale, hoverScale);
        });
        dragControls.addEventListener('hoveroff', function (event) {

            mesh.geometry.scale(inverseHoverScale, inverseHoverScale, inverseHoverScale);
        });
    })();

    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(render);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = .5;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {

    // camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    // camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    // camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
    // camera.lookAt(scene.position);
    for (let el of document.getElementsByClassName("symbol"))
        (el as HTMLDivElement).style.visibility = "hidden";

    for (let [symbol, i] of symbols) {
        camera.updateMatrixWorld(true);
        let screenspace = normalizeDeviceSpace((new Vector3(curve[i], curve[i + 1], curve[i + 2])).project(camera), window.innerWidth, window.innerHeight);
        if (screenspace.x == 0)
            symbol.style.visibility = 'hidden';
        else
            symbol.style.visibility = 'visible';
        symbol.style.left = screenspace.x - 5.5 + 'px';
        symbol.style.top = screenspace.y - 30 + 'px';
    }

    renderer.render(scene, camera);
}