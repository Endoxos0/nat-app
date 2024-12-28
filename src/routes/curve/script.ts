import { OrthographicCamera, Scene, WebGLRenderer, PCFSoftShadowMap, MeshBasicMaterial, Mesh, Vector3, Curve, TubeGeometry } from "three";
import { Noise, perlinCurve } from "$lib/perlinNoise";
import { CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { CustomSinCurve, PerlinCurve } from "$lib/curves";

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

    const geometry = new TubeGeometry(new PerlinCurve({ scale: 2, amplitude: 3, start: -20, end: 20 }), 1000, 0.1, 15, false);
    const material = new MeshBasicMaterial({ color: 0xFFFFFF });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
}

export function animate() {
    controlsGl.update();
    rendererGl.render(scene, camera);
    rendererCss.render(scene, camera);
}