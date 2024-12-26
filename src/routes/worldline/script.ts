import { OrthographicCamera, Scene, WebGLRenderer, Color, PCFSoftShadowMap, SphereGeometry, MeshBasicMaterial, Mesh, Vector3 } from "three";
import katex, { render } from "katex";
import { perlinCurve, Noise, perlinCurveP } from "$lib/perlinNoise";
import { perlinGridLine, perlinGridLineP } from "$lib/gridBasisVectors";
import { curveMesh, loopCurve } from "$lib/curves";
import { limitDifference, minimalDifference, vectorMesh } from "$lib/Vector";
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

    let worldLineMesh = curveMesh({ samples: perlinCurve({ N: 30, delta: 0.1, amplitude: 1 }) });
    scene.add(worldLineMesh);

    //#region symbols
    let symbolShift = 5;
    I = Math.round(worldLineMesh.geometry.points.length / (2 * 3 * n)) * (3 * n) - 3 * n * symbolShift;

    var xpos = [50, -10, 30, 70, 110];
    var ypos = [60, -40, 0, 40, 80];
    var zpos = [-30, -50, 0, 50, 100];

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
    // scene.add(gridcurveX);
    // scene.add(gridcurveY);

    //#region User Parameter
    let w = 2;
    let b1 = perlinGridLine({ P: parameterSphere.position, shift, stretch, perlin });
    let b2 = perlinGridLineP({ P: parameterSphere.position, shift, stretch, perlin });
    let basis1Mesh = vectorMesh(parameterSphere.position, limitDifference(minimalDifference(parameterSphere.position, b1).curveIndex, b1).normalize().multiplyScalar(w), 0x808080);
    let basis2Mesh = vectorMesh(parameterSphere.position, limitDifference(minimalDifference(parameterSphere.position, b2).curveIndex, b2).normalize().multiplyScalar(-w), 0x808080);
    scene.add(basis1Mesh.group);
    scene.add(basis2Mesh.group);
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