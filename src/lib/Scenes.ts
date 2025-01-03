import { OrthographicCamera, Scene, WebGLRenderer, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, TubeGeometry, Group, GridHelper, PolarGridHelper, Quaternion, Euler } from "three";
import katex from "katex";
import { LoopCurve, PerlinCurve } from "$lib/curves";
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
        this.camera.zoom = 7;
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

        let grid = new GridHelper(7, 7, 0x2B2B2B);
        grid.scale.set(3, 3, 3);
        this.scene.add(grid);

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

export class VelocityScene extends CustomScene {
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
        this.camera.zoom = 7;
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

        let interval = [-10, 10];
        let N = Math.abs(interval[0]) + Math.abs(interval[1]);
        let T = Math.abs(interval[0]) / N;
        const parameterSphere = new CurveParameter(.25);
        dragControls.objects.push(parameterSphere);
        parameterSphere.position.copy(worldline.getPointAt(T));
        this.scene.add(parameterSphere);
        dragControls.addEventListener('drag', function (event) {
            (event.object as CurveParameter).restrictToCurve(worldline);
            T = (event.object as CurveParameter).T;
        });

        let v = new Vector(parameterSphere.position, worldline.getTangentAt(T).normalize().multiplyScalar(4), '\\overrightarrow{v}', 0x00FF00);
        let ve = decompose(v.vector);
        let v0e0 = new Vector(parameterSphere.position, new Vector3().setX(ve.x), 'v^0\\overrightarrow{e_0}', 0x808080);
        let v1e1 = new Vector(parameterSphere.position, new Vector3().setZ(ve.z), 'v^1\\overrightarrow{e_1}', 0x808080);
        this.scene.add(v, v0e0, v1e1);
        dragControls.addEventListener('drag', (event) => {
            v.setVector(parameterSphere.position, worldline.getTangentAt(T).normalize().multiplyScalar(4));
            let ve = decompose(v.vector);
            v0e0.setVector(parameterSphere.position, new Vector3().setX(ve.x));
            v1e1.setVector(parameterSphere.position, new Vector3().setZ(ve.z));
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

export class SquareGridScene extends CustomScene {
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
        this.scene.add(new GridHelper(10, 10));
        const mat0 = new MeshBasicMaterial({ color: 0xFFFFFF });
        let OriginGeometry = new SphereGeometry(.2, 50, 50);
        let OriginMesh = new Mesh(OriginGeometry, mat0);
        this.scene.add(OriginMesh);
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

export class PolarGridScene extends CustomScene {
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
        this.camera.zoom = 2;
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
        this.scene.add(new PolarGridHelper(10, 16, 8, 64));
        const mat0 = new MeshBasicMaterial({ color: 0xFFFFFF });
        let OriginGeometry = new SphereGeometry(.2, 50, 50);
        let OriginMesh = new Mesh(OriginGeometry, mat0);
        this.scene.add(OriginMesh);
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

export class GeodesicsOnSphereScene extends CustomScene {
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
        this.camera.position.set(10, 10, 0);
        this.camera.zoom = 20;
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

        const mat0 = new MeshBasicMaterial({ color: 0x2b2b2b });
        const mat1 = new MeshBasicMaterial({ color: 0xFF0000 });

        let radius = 1;
        const group = new Group();
        for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 11)
            group.add(new Mesh(new TubeGeometry(new LoopCurve({ radius, quat: new Euler(Math.PI / 2, 0, i) }), 1000, 0.005, 15, false), mat0));

        let n = 6;
        for (let i = - radius; i <= radius; i += radius / n) {
            let shift = new Vector3(0, i, 0);
            group.add(new Mesh(new TubeGeometry(new LoopCurve({ radius: radius * Math.sqrt(1 - i * i), shift, quat: new Euler(0, 0, 0) }), 1000, 0.005, 15, false), mat0));
        }

        group.add(new Mesh(new TubeGeometry(new LoopCurve({ radius, quat: new Euler(Math.PI / 2, 0, 0), start: 1.5 * Math.PI, end: 2.5 * Math.PI }), 1000, 0.006, 15, false), mat1));
        group.add(new Mesh(new TubeGeometry(new LoopCurve({ radius, quat: new Euler(Math.PI / 2, 0, Math.PI / 11), start: 1.5 * Math.PI, end: 2.5 * Math.PI }), 1000, 0.006, 15, false), mat1));

        const geometry = new SphereGeometry(radius - 0.01, 50, 50);
        const material = new MeshBasicMaterial({ color: 0x000000 });
        const sphere = new Mesh(geometry, material);
        group.add(sphere);

        this.scene.add(group);
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
