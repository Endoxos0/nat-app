import { OrthographicCamera, Scene, WebGLRenderer, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, TubeGeometry, Group } from "three";
import katex from "katex";
import { Noise } from "$lib/perlinNoise";
import { closestPointToPoint, PerlinCurve, PerlinCurveAtPoint } from "$lib/curves";
import { decompose, Vector } from "$lib/Vector";
import { CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { symbolOf } from "$lib/symbol";
import { CurveParameter } from "$lib/parameter";
import { CustomScene } from "$lib/constructor";

export class WorldlineScene extends CustomScene {
    camera: OrthographicCamera;
    scene: Scene;
    rendererGl: WebGLRenderer;
    rendererCss: CSS3DRenderer;
    controlsGl: OrbitControls;

    constructor(CssDomElement: HTMLElement, WebGLDomElement: HTMLElement) {
        super(CssDomElement, WebGLDomElement);
        //#region Scene Setup
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 50;
        this.camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
        this.camera.position.set(0, 10, 0);
        this.camera.zoom = 4.1;
        this.camera.updateProjectionMatrix();
        // camera.position.set(-2.4517250746012427, 6.920649464598646, 6.7892308214349395);
        this.scene = new Scene();

        this.rendererCss = new CSS3DRenderer();
        this.rendererCss.setSize(WebGLDomElement.clientWidth, WebGLDomElement.clientHeight);
        CssDomElement.appendChild(this.rendererCss.domElement);

        this.rendererGl = new WebGLRenderer({ antialias: true, alpha: true });
        this.rendererGl.setClearColor(0x000000, 0.0);
        this.rendererGl.setSize(WebGLDomElement.clientWidth, WebGLDomElement.clientHeight);
        this.rendererGl.setPixelRatio(window.devicePixelRatio);
        this.rendererGl.shadowMap.enabled = true;
        this.rendererGl.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
        WebGLDomElement.appendChild(this.rendererGl.domElement);

        this.controlsGl = new OrbitControls(this.camera, this.rendererGl.domElement);

        const onWindowResize = () => {
            const aspect = WebGLDomElement.clientWidth / WebGLDomElement.clientHeight;

            this.camera.left = - frustumSize * aspect / 2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = - frustumSize / 2;

            this.camera.updateProjectionMatrix();

            this.rendererGl.setSize(WebGLDomElement.clientWidth, WebGLDomElement.clientHeight);
            this.rendererCss.setSize(WebGLDomElement.clientWidth, WebGLDomElement.clientHeight);
        };
        window.addEventListener('resize', onWindowResize);
        //#endregion

        const dragControls = new DragControls([], this.camera, this.rendererGl.domElement);
        dragControls.addEventListener('dragstart', (event) => this.controlsGl.enabled = false);
        dragControls.addEventListener('dragend', (event) => this.controlsGl.enabled = true);
        const hoverScale = 1.5;
        dragControls.addEventListener('hoveron', (event) => event.object.scale.multiplyScalar(hoverScale));
        dragControls.addEventListener('hoveroff', (event) => event.object.scale.divideScalar(hoverScale));
        const mat0 = new MeshBasicMaterial({ color: 0xFFFFFF });
        const mat1 = new MeshBasicMaterial({ color: 0x2B2B2B });

        const worldline = new PerlinCurve({ amplitude: 1, start: -20, end: 20 });
        const curve_geometry = new TubeGeometry(worldline, 1000, 0.01, 15, false);
        const mesh = new Mesh(curve_geometry, mat0);
        this.scene.add(mesh);

        let worldlineIntervals = new Group();
        let interval = [-10, 10];
        let N = Math.abs(interval[0]) + Math.abs(interval[1]);
        for (let i = interval[0]; i <= interval[1]; i++) {
            const point = worldline.getPointAt((i + Math.abs(interval[0])) / N);
            const offset = new Vector3(0, 0, -.5);

            const geometry = new SphereGeometry(.1, 32, 32);
            const material = new MeshBasicMaterial({ color: 'white' });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(point);

            point.add(offset);
            let symbol = symbolOf({ c: (i).toString() });
            symbol.rotateX(-Math.PI / 2);
            symbol.position.copy(point);
            worldlineIntervals.add(mesh, symbol);
        }
        this.scene.add(worldlineIntervals);

        let properTime: number = 0;
        let properTimeNode = (WebGLDomElement.querySelector("#propertime") as HTMLElement);
        let T = Math.abs(interval[0]) / N;
        const parameterSphere = new CurveParameter(.25);
        dragControls.objects.push(parameterSphere);
        parameterSphere.position.copy(worldline.getPointAt(T));
        this.scene.add(parameterSphere);
        dragControls.addEventListener('drag', function (event) {
            (event.object as CurveParameter).restrictToCurve(worldline);
            T = (event.object as CurveParameter).T;
            properTime = interval[0] + (event.object as CurveParameter).T * (interval[1] - interval[0]);
            properTimeNode.innerHTML = katex.renderToString(`\\tau =${ properTime.toFixed(2) }`);
        });
    };

    start() {
        this.rendererGl.setAnimationLoop(() => {
            this.controlsGl.update();
            this.rendererGl.render(this.scene, this.camera);
            this.rendererCss.render(this.scene, this.camera);
        });
    }

    stop(): void {
        this.rendererGl.setAnimationLoop(null);
    }

    cleanup() {
        console.clear();
        if (this.rendererCss.domElement)
            this.rendererCss.domElement.remove();
        if (this.rendererGl.domElement)
            this.rendererGl.domElement.remove();
    }
}


