import { PerspectiveCamera, Scene, MeshBasicMaterial, DoubleSide, Color, PlaneGeometry, Mesh, Vector3, WebGLRenderer, BoxGeometry, Camera, OrthographicCamera } from "three";
import { TrackballControls, CSS3DObject, CSS3DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";

var camera: Camera, sceneGl: Scene, rendererGl: WebGLRenderer;
var sceneCss: Scene, rendererCss: CSS3DRenderer;
var controls: OrbitControls;

export function init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    // camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 50;
    camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, .1, 100);
    camera.position.set(200, 200, 200);

    controls = new OrbitControls(camera, canvas);

    sceneGl = new Scene();
    sceneCss = new Scene();

    var xpos = [50, -10, 30, 70, 110];
    var ypos = [60, -40, 0, 40, 80];
    var zpos = [-30, -50, 0, 50, 100];

    for (var i = 0; i < 5; i++) {
        var element = document.createElement('div');
        element.style.width = '100px';
        element.style.height = '100px';
        element.style.opacity = '1.0';
        element.style.background = new Color(Math.random() * 0xff0000).getStyle();
        element.innerText = 'je moeder';

        var object = new CSS3DObject(element);
        object.position.x = xpos[i];
        object.position.y = ypos[i];
        object.position.z = zpos[i];
        object.rotation.x = Math.PI / (i + 5);
        object.rotation.y = Math.PI / (21 - 2 * i);
        object.rotation.z = Math.PI / (3 * i + 25);
        object.scale.x = i / 12 + 0.5;
        object.scale.y = 1 / (12 - i) + 0.5;
        sceneCss.add(object);
    }

    rendererCss = new CSS3DRenderer({});
    rendererCss.setSize(window.innerWidth, window.innerHeight);
    rendererCss.domElement.style.position = 'absolute';
    rendererCss.domElement.style.top = '0';

    rendererGl = new WebGLRenderer({ canvas, alpha: true });
    rendererGl.setClearColor(0x00ff00, 0.0);
    rendererGl.setSize(window.innerWidth, window.innerHeight);
    rendererGl.domElement.style.position = 'absolute';
    rendererGl.domElement.style.zIndex = '1';
    rendererGl.domElement.style.top = '0';
    rendererCss.domElement.appendChild(rendererGl.domElement);

    document.body.appendChild(rendererCss.domElement);

}

export function animate() {

    requestAnimationFrame(animate);

    controls.update();

    rendererGl.render(sceneGl, camera);
    rendererCss.render(sceneCss, camera);
}