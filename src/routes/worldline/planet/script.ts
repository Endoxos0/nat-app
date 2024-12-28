import { OrthographicCamera, Scene, WebGLRenderer, DirectionalLight } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { orbWireframe, sphere } from "$lib/curves";

let camera: OrthographicCamera, scene: Scene, renderer: WebGLRenderer;
const frustumSize = 50;

let curve: number[];
export const symbols: [HTMLDivElement, number][] = [];
let n = 16;
let I: number;
let properTime: number;

export function init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const aspect = window.innerWidth / window.innerHeight;
    camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
    // camera.position.setY(10);
    camera.position.set(...[
        8.160970910866846,
        5.286975970297566,
        2.333760673565631
    ]);
    camera.zoom = 7;
    camera.updateProjectionMatrix();
    scene = new Scene();

    const dragControls = new DragControls([], camera, canvas);

    scene.add(orbWireframe({ radius: 1 }));
    let spher = sphere({ radius: .06, color: 0xFF0000 });
    spher.position.setX(1);
    scene.add(spher);

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(render);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 1;

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

    // console.log([...camera.position]);

    // for (let el of document.getElementsByClassName("symbol"))
    //     (el as HTMLDivElement).style.visibility = "hidden";

    // for (let [symbol, i] of symbols) {
    //     camera.updateMatrixWorld(true);
    //     let screenspace = normalizeDeviceSpace((new Vector3(curve[i], curve[i + 1], curve[i + 2])).project(camera), window.innerWidth, window.innerHeight);
    //     if (screenspace.x == 0)
    //         symbol.style.visibility = 'hidden';
    //     else
    //         symbol.style.visibility = 'visible';
    //     symbol.style.left = screenspace.x - 5.5 + 'px';
    //     symbol.style.top = screenspace.y - 30 + 'px';
    // }

    renderer.render(scene, camera);
}