import { OrthographicCamera, Scene, WebGLRenderer, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3, TubeGeometry, Object3D } from "three";
import katex from "katex";
import { Noise } from "$lib/perlinNoise";
import { closestPointToPoint, CurveBasisVectorAtPoint, PerlinCurve, PerlinCurveAtPoint, PerlinGridLineAtPoint } from "$lib/curves";
import { decompose, Vector } from "$lib/Vector";
import { CSS3DRenderer, OrbitControls, DragControls } from "three/examples/jsm/Addons.js";
import { symbolOf } from "$lib/symbol";
import { CurveParameter as CurveParameter } from "$lib/parameter";
import { CustomScene } from "$lib/constructor";

export class ChristoffelScene extends CustomScene {
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
        const mat0 = new MeshBasicMaterial({ color: 0x6f706f });
        const mat1 = new MeshBasicMaterial({ color: 0x2B2B2B });
        const mat2 = new MeshBasicMaterial({ color: 0x4a4a4a });

        let perlin = new Noise();
        let perlinX0 = new Noise();
        let gridSize = 40;
        let shift = .5;
        let stretch = .1;
        for (let i = -gridSize; i < gridSize; i++) {
            const x0 = new PerlinCurve({ start: -20, end: 20, ySample: stretch * i, shift: shift * i, perlin });
            const x0_geometry = new TubeGeometry(x0, 1000, 0.01, 15, false);
            const x0_mesh = new Mesh(x0_geometry, mat1);
            this.scene.add(x0_mesh);
            const x1 = new PerlinCurve({ start: -20, end: 20, ySample: stretch * i, shift: shift * i, perlin: perlinX0, theta: Math.PI / 3 });
            const x1_geometry = new TubeGeometry(x1, 1000, 0.01, 15, false);
            const x1_mesh = new Mesh(x1_geometry, mat1);
            this.scene.add(x1_mesh);
        }

        const path = new PerlinCurve({ start: -20, end: 20, perlin });
        const curve_geometry = new TubeGeometry(path, 1000, 0.01, 15, false);
        const mesh = new Mesh(curve_geometry, mat0);
        mesh.position.setY(0.001);
        this.scene.add(mesh);

        const P1 = new CurveParameter(.25);
        const P2 = new CurveParameter(.25);
        dragControls.objects.push(P1);
        dragControls.objects.push(P2);
        P1.position.copy(path.getPointAt(.4));
        P2.position.copy(path.getPointAt(.6));
        this.scene.add(P1);
        this.scene.add(P2);
        dragControls.addEventListener('drag', function (event) {
            (event.object as CurveParameter).restrictToCurve(path);
        });

        let basisLength = 6;

        let x0 = new PerlinGridLineAtPoint(P1.position, stretch, shift, perlin);
        let x1 = new PerlinGridLineAtPoint(P1.position, stretch, shift, perlinX0, Math.PI / 3);
        let x1s = new PerlinGridLineAtPoint(P2.position, stretch, shift, perlinX0, Math.PI / 3);

        let e0 = new CurveBasisVectorAtPoint(P1.position, x0.curve, basisLength, "\\overrightarrow{e_0}");
        let e1 = new CurveBasisVectorAtPoint(P1.position, x1.curve, basisLength, "\\overrightarrow{e_1}");
        let E1 = new Vector(P2.position, e1.vector, "\\overrightarrow{e_1}", 0x808080);
        let e1s = new CurveBasisVectorAtPoint(P2.position, x1s.curve, basisLength, "\\overrightarrow{e_1'}", 0x2B2B2B);
        let de1dx0 = new Vector(P2.position.clone().add(e1s.vector), E1.vector.clone().sub(e1s.vector), "", 0xFFFFFF);
        let de1dx0s = new Vector(P2.position.clone(), E1.vector.clone().sub(e1s.vector), "\\dfrac{\\mathrm{d}\\overrightarrow{e_1}}{\\mathrm{d}x^0}", 0xFFFFFF);
        let de1dx0_decomposition = decompose(de1dx0.vector);
        let de1dx0s_0 = new Vector(P2.position, new Vector3().setX(de1dx0_decomposition.x), '\\Gamma^0_{10}', 0x808080);
        let de1dx0s_1 = new Vector(P2.position, new Vector3().setZ(de1dx0_decomposition.z), '\\Gamma^1_{10}', 0x808080);
        this.scene.add(x0, x1, x1s, e1, E1, e1s, de1dx0, de1dx0s, de1dx0s_0, de1dx0s_1);
        dragControls.addEventListener('drag', (event) => {
            x0.setPoint(P1.position);
            x1.setPoint(P1.position);
            x1s.setPoint(P2.position);
            e0.setVector(P1.position);
            e1.setVector(P1.position);
            E1.setVector(P2.position, e1.vector);
            e1s.setVector(P2.position);
            de1dx0.setVector(P2.position.clone().add(e1s.vector), E1.vector.clone().sub(e1s.vector),);
            de1dx0s.setVector(P2.position, E1.vector.clone().sub(e1s.vector));
            de1dx0_decomposition = decompose(de1dx0.vector);
            de1dx0s_0.setVector(P2.position, new Vector3().setX(de1dx0_decomposition.x));
            de1dx0s_1.setVector(P2.position, new Vector3().setZ(de1dx0_decomposition.z));
        });
    };

    start() {
        this.rendererGl.setAnimationLoop(() => {
            this.controlsGl.update();
            this.rendererGl.render(this.scene, this.camera);
            this.rendererCss.render(this.scene, this.camera);
        });
    }

    cleanup() {
        console.clear();
        if (this.rendererCss.domElement)
            this.rendererCss.domElement.remove();
        if (this.rendererGl.domElement)
            this.rendererGl.domElement.remove();
    }
}