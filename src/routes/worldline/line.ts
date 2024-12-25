import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { findClosestPointOnCurve, generateFlowingCurve2D, generateFlowingCurve3D, normalizeDeviceSpace, splitArray } from "./curve";
import { DragControls } from 'three/addons/controls/DragControls.js';
import katex from "katex";

export function tangentVector(a: Vector3, r: Vector3, scale: number): [Vector3, Vector3] {
    return [a, a.clone().add(r.clone().multiplyScalar(scale))];
}

export function vectorMesh(A: Vector3, B: Vector3) {
    let r = B.clone().sub(A);
    r.normalize();

    const geometry = new MeshLineGeometry();
    geometry.setPoints([...A, ...A.clone().add(r.clone().multiplyScalar(.25)), ...A.clone().add(r.clone().multiplyScalar(.5)), ...A.clone().add(r.clone().multiplyScalar(.75)), ...B]);
    const res = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const material = new MeshLineMaterial({ color: new THREE.Color(0xff0000), lineWidth: 0.03, opacity: 1, dashArray: 0.1, dashRatio: 0.2, resolution: res });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.raycast = raycast;

    const coneGeometry = new THREE.ConeGeometry(.2, .6, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(B.x, B.y, B.z);

    //cone-rotation
    const quaternion = new THREE.Quaternion();
    const start = new THREE.Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(start, r);
    cone.setRotationFromQuaternion(quaternion);


    const parameterChange = (a: Vector3, b: Vector3) => {
        geometry.setPoints([...a, ...b]);
        cone.position.set(b.x, b.y, b.z);

        let r = b.clone().sub(a);
        r.normalize();
        const quaternion = new THREE.Quaternion();
        const start = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(start, r);
        cone.setRotationFromQuaternion(quaternion);
    };

    return { line: mesh, cone: cone, parameterChange: parameterChange };
};