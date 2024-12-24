import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';

export function init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const p = 1;
    const sizes = {
        width: p * window.innerWidth,
        height: p * window.innerHeight,
    };
    const camera = new THREE.OrthographicCamera(sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, -1000, 5000);
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.setAnimationLoop(animate);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;

    window.addEventListener('resize', () => {
        //Update Sizes
        sizes.width = p * window.innerWidth;
        sizes.height = p * window.innerHeight;
        //Update Camera
        camera.left = sizes.width / - 2;
        camera.right = sizes.width / 2;
        camera.top = sizes.height / 2;
        camera.bottom = sizes.height / - 2;

        camera.updateProjectionMatrix();
        //camera.aspect = sizes.width / sizes.height
        renderer.setSize(sizes.width, sizes.height);
    });
    // (() => {
    //     const geometry = new THREE.SphereGeometry(250, 16, 10);
    //     const material = new THREE.MeshStandardMaterial({
    //         color: '#ffffff'
    //     });
    //     const mesh = new THREE.Mesh(geometry, material);
    //     scene.add(mesh);
    // })();

    const geometry = new MeshLineGeometry();
    const points = [];

    let f = 20;
    let n = 10000;
    let dn = 0.01;
    for (let i = 0; i < n; i += dn) points.push(f * i, f * Math.sin(i), 0);

    geometry.setPoints(points);
    const res = new THREE.Vector2(sizes.width, sizes.height);
    const material = new MeshLineMaterial({ color: new THREE.Color(0xffff00), lineWidth: 0.01, dashArray: 0.1, dashRatio: 0.2, resolution: res });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.raycast = raycast;
    scene.add(mesh);

    (() => {
        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    })();

    const light = new THREE.AmbientLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    // scene.add(light);

    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }
}