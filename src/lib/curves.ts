import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { Group, SphereGeometry, MeshBasicMaterial, Mesh, Color, Vector2, Vector3, Curve, Matrix3 } from "three";
import { Noise, perlinCurveSampler } from "./perlinNoise";

export function loopCurve({ radius, shift = 0, delta = 0.01 }: { delta?: number, radius: number, shift?: number; }) {
    const samples: number[] = [];
    for (let I = 0; I < 2 * Math.PI; I += delta) {
        samples.push(
            radius * Math.cos(I),
            shift,
            radius * Math.sin(I),
        );
    }
    return samples;
}

export function loopCurveP({ radius, shift = 0, delta = 0.01, theta = 2789 }: { delta?: number, radius: number, shift?: number; theta?: number; }) {
    const samples: number[] = [];
    for (let I = 0; I < 2 * Math.PI; I += delta) {
        samples.push(
            radius * Math.cos(I) * Math.cos(theta),
            radius * Math.sin(I),
            radius * Math.cos(I) * Math.sin(theta),
        );
    }
    return samples;
}

export function sphereIntersectionCurve({ radius, shift = 0, delta = 0.01 }: { delta?: number, radius: number, shift?: number; }) {
    const samples: number[] = [];
    for (let I = 0; I < 2 * Math.PI; I += delta) {
        samples.push(
            radius * Math.sqrt(1 - shift ** 2) * Math.cos(I),
            shift,
            radius * Math.sqrt(1 - shift ** 2) * Math.sin(I),
        );
    }
    return samples;
}

export function orbWireframe({ radius, }: { radius: number; }) {
    const group = new Group();
    for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 5)
        group.add(curveMesh({ samples: loopCurveP({ radius, theta: i }), color: 0x383838 }));

    let n = 4;
    for (let i = - radius; i <= radius; i += radius / n)
        group.add(curveMesh({ samples: sphereIntersectionCurve({ radius: radius, shift: i }), color: 0x383838 }));

    const geometry = new SphereGeometry(radius - 0.01, 50, 50);
    const material = new MeshBasicMaterial({ color: 0x000000 });
    const sphere = new Mesh(geometry, material);
    group.add(sphere);

    return group;
}

export function sphere({ radius, color = 0x000000 }: { radius: number; color?: number | Color; }) {
    const geometry = new SphereGeometry(radius - 0.01, 50, 50);
    const material = new MeshBasicMaterial({ color: color });
    const sphere = new Mesh(geometry, material);
    return sphere;
}

export function curveMesh({ samples, color = new Color('white'), opacity = 1, lineWidth = 0.01 }: { samples: number[], color?: number | Color, opacity?: number, lineWidth?: number; }) {
    const geometry = new MeshLineGeometry();
    geometry.setPoints(samples);
    const res = new Vector2(window.innerWidth, window.innerHeight);
    const material = new MeshLineMaterial({ color: color, lineWidth: lineWidth, dashArray: 0, dashRatio: 0.2, resolution: res, });
    const mesh = new Mesh(geometry, material);
    mesh.raycast = raycast;
    return mesh;
}

export class PerlinCurve extends Curve<Vector3> {
    perlin: Noise;
    ySample: number;
    amplitude: number | undefined;
    shift: number;
    scale: number;
    start: number;
    theta: number;
    end: number;

    constructor({ ySample = 0, shift = 0, amplitude = 1, scale = 1, start = 0, end = 1, perlin = new Noise(), theta = 0 }: { ySample?: number, shift?: number, amplitude?: number, scale?: number, start?: number, end?: number, theta?: number, perlin?: Noise; }) {
        super();
        this.ySample = ySample;
        this.shift = shift;
        this.amplitude = amplitude;
        this.scale = scale;
        this.start = start;
        this.end = end;
        this.theta = theta;
        this.perlin = perlin;
    }

    getPoint(t: number, optionalTarget = new Vector3()) {
        t = this.start + t * (this.end - this.start);
        const tx = t;
        const ty = 0;
        const tz = perlinCurveSampler({ x: t, ySample: this.ySample, shift: this.shift, amplitude: this.amplitude, perlin: this.perlin });

        const R = new Matrix3(
            Math.cos(this.theta), 0, Math.sin(this.theta),
            0, 1, 0,
            -Math.sin(this.theta), 0, Math.cos(this.theta));
        return optionalTarget.set(tx, ty, tz).applyMatrix3(R).multiplyScalar(this.scale);
    }
}

export class CustomSinCurve extends Curve<Vector3> {
    scale: number;
    start: number;
    end: number;

    constructor(scale = 1, start = 0, end = 1) {
        super();
        this.scale = scale;
        this.start = start;
        this.end = end;
    }

    getPoint(t: number, optionalTarget = new Vector3()) {
        t = this.start + t * (this.end - this.start);
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

export class CircleCurve extends Curve<Vector3> {
    scale: number;
    radius: number;

    constructor(scale = 1, radius = 1) {
        super();
        this.scale = scale;
        this.radius = radius;
    }

    getPoint(t: number, optionalTarget = new Vector3()) {
        t *= 2 * Math.PI;
        const tx = this.radius * Math.cos(t);
        const ty = 0;
        const tz = this.radius * Math.sin(t);

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

export function closestPointToPoint<TCurve extends Curve<Vector3>>(point: Vector3, curve: TCurve, delta = 0.01): [Vector3, number] {
    let closestPoint: Vector3 = curve.getPoint(0);
    let mint = Infinity;
    let minDistance = Infinity;

    for (let i = 0; i < 1; i += delta) {
        const curvePoint: Vector3 = curve.getPoint(i);
        const distance = point.distanceTo(curvePoint);
        if (distance < minDistance) {
            mint = i;
            minDistance = distance;
            closestPoint = curvePoint;
        }
    }

    return [closestPoint, mint];
};