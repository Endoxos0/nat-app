import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { Vector2, Vector3, Color, Mesh, ConeGeometry, MeshBasicMaterial, Quaternion, Group, Matrix3, Matrix2 } from 'three';
import { symbolOf } from './symbol';

export function normalizeDeviceSpace(vector: Vector3, width: number, height: number): Vector2 {
    var v = new Vector2((vector.x + 1) * width / 2, - (vector.y - 1) * height / 2);
    var margin = 40;
    if (v.x >= width - margin || v.y >= height - margin)
        v = new Vector2(0, 0);
    return v;
};

/**
 * Calculates Euclidean distance between two 3D points
 * @param {number[]} p1 - First point [x, y, z]
 * @param {number[]} p2 - Second point [x, y, z]
 * @returns {number} Distance between points
 */
function calculateDistance(p1: Vector3, p2: Vector3) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Finds the closest point on a 3D curve to a given point
 * @param {number[]} point - Array of [x, y, z] coordinates
 * @param {number[]} curve - Flat array of curve points [x1,y1,z1,x2,y2,z2,...]
 * @returns {number[]} Closest point on curve [x, y, z]
 */
export function minimalDifference(point: Vector3, curve: number[] | Float32Array<ArrayBufferLike>): { minV: Vector3, curveIndex: number; } {
    if (curve.length === 0 || curve.length % 3 !== 0) {
        throw new Error('Curve array must contain complete 3D points (multiple of 3)');
    }

    let minV = new Vector3();
    let closestIndex: number = 0;
    let minDistance = Infinity;

    // Iterate through curve points
    for (let i = 0; i < curve.length; i += 3) {
        const V: Vector3 = new Vector3(curve[i], curve[i + 1], curve[i + 2]).sub(point);
        const distance = V.length();
        if (distance < minDistance) {
            minDistance = distance;
            minV = V;
            closestIndex = i;
        }
    }

    return { minV, curveIndex: closestIndex };
}

export function findClosestPoint(point: Vector3, curve: number[] | Float32Array<ArrayBufferLike>): { point: Vector3, curveIndex: number; } {
    if (curve.length === 0 || curve.length % 3 !== 0) {
        throw new Error('Curve array must contain complete 3D points (multiple of 3)');
    }

    let closestPoint: Vector3 = new Vector3(curve[0], curve[1], curve[2]);
    let closestIndex: number = 0;
    let minDiff = new Vector3();
    let minDistance = Infinity;

    // Iterate through curve points
    for (let i = 0; i < curve.length; i += 3) {
        const curvePoint: Vector3 = new Vector3(curve[i], curve[i + 1], curve[i + 2]);
        const distance = calculateDistance(point, curvePoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = curvePoint;
            closestIndex = i;
        }
    }

    return { point: closestPoint, curveIndex: closestIndex };
}

export function vectorMesh(s: Vector3, r: Vector3, color: number = 0xFF0000, c: string = 'v') {
    const group = new Group();
    const geometry = new MeshLineGeometry();
    geometry.setPoints([...s, ...s.clone().add(r)]);
    const res = new Vector2(window.innerWidth, window.innerHeight);
    const material = new MeshLineMaterial({ color: color, lineWidth: 0.01, dashArray: 0, dashRatio: 0.2, resolution: res, opacity: .8 });
    material.transparent = true;
    const mesh = new Mesh(geometry, material);
    mesh.raycast = raycast;
    group.add(mesh);

    const coneGeometry = new ConeGeometry(.09, .3, 32);
    const coneMaterial = new MeshBasicMaterial({ color: color, transparent: true, opacity: .8 });
    const cone = new Mesh(coneGeometry, coneMaterial);
    cone.position.copy(s.clone().add(r));

    const quaternion = new Quaternion();
    const start = new Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(start, r.clone().normalize());
    cone.setRotationFromQuaternion(quaternion);
    group.add(cone);
    group.position.setY(.1);

    const offsetScale = .4;
    const offset: Vector3 = r.clone().normalize().multiplyScalar(offsetScale);
    const symbol = symbolOf({ c });
    symbol.rotateX(-Math.PI / 2);
    symbol.position.set(geometry.points[3] + offset.x, geometry.points[4] + offset.y, geometry.points[5] + offset.z);
    group.add(symbol);

    const parameterChange = (s: Vector3, r: Vector3) => {
        geometry.setPoints([...s, ...s.clone().add(r)]);
        cone.position.copy(s.clone().add(r));

        const quaternion = new Quaternion();
        const start = new Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(start, r.clone().normalize());
        cone.setRotationFromQuaternion(quaternion);

        const offset: Vector3 = r.clone().normalize().multiplyScalar(offsetScale);
        symbol.position.set(geometry.points[3] + offset.x, geometry.points[4] + offset.y, geometry.points[5] + offset.z);
    };

    return { group, parameterChange: parameterChange };
};

export function limitDifference(i: number, curve: number[] | Float32Array<ArrayBufferLike>): Vector3 {
    return new Vector3(curve[i + 3] - curve[i], curve[i + 4] - curve[i + 1], curve[i + 5] - curve[i + 2]);
}

export function decompose(v: Vector3, e0 = new Vector3(1, 0, 0), e1 = new Vector3(0, 1, 0), e2 = new Vector3(0, 0, 1)) {
    let M = new Matrix3(
        e0.x, e1.x, e2.x,
        e0.y, e1.y, e2.y,
        e0.z, e1.z, e2.z,
    );
    return v.clone().applyMatrix3(M.invert());
}