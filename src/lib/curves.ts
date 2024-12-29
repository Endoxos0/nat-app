import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { Group, SphereGeometry, MeshBasicMaterial, Mesh, Color, Vector2, Vector3, Curve, Matrix3, Matrix2, TubeGeometry, Quaternion } from "three";
import { Noise, perlinCurveSampler } from "./perlinNoise";
import { findParameterForPoint } from "./gridBasisVectors";
import { Vector } from "./Vector";

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
    let closestPoint: Vector3 = curve.getPointAt(0);
    let mint = Infinity;
    let minDistance = Infinity;

    for (let i = 0; i < 1; i += delta) {
        const curvePoint: Vector3 = curve.getPointAt(i);
        const distance = point.distanceTo(curvePoint);
        if (distance < minDistance) {
            mint = i;
            minDistance = distance;
            closestPoint = curvePoint;
        }
    }

    return [closestPoint, mint];
};

export class PerlinCurveAtPoint extends Curve<Vector3> {
    perlin: Noise;
    private _point: Vector3;
    public get point(): Vector3 {
        return this._point;
    }
    public set point(point: Vector3) {
        this.s = findParameterForPoint(
            (x, q) => perlinCurveSampler({ x, ySample: this.stretch * q, shift: this.shift * q, perlin: this.perlin }),
            new Vector2(point.x, point.z).rotateAround(new Vector2(), this.theta), -50, 50, 1e-10, 10000) as number;
        this._point = point;
    }
    amplitude: number | undefined;
    scale: number;
    start: number;
    stretch: number;
    theta: number;
    end: number;
    shift: number;
    s: number;

    constructor({ point, amplitude = 1, stretch, shift, scale = 1, start = 0, end = 1, perlin = new Noise(), theta = 0 }: { point: Vector3, amplitude?: number, shift: number, scale?: number, stretch: number, start?: number, end?: number, theta?: number, perlin?: Noise; }) {
        super();
        this._point = point;
        this.amplitude = amplitude;
        this.scale = scale;
        this.stretch = stretch;
        this.start = start;
        this.shift = shift;
        this.end = end;
        this.theta = theta;
        this.perlin = perlin;

        this.s = findParameterForPoint(
            (x, q) => perlinCurveSampler({ x, ySample: this.stretch * q, shift: this.shift * q, perlin: this.perlin }),
            new Vector2(point.x, point.z).rotateAround(new Vector2(), this.theta), -50, 50, 1e-10, 10000) as number;
    }

    getPoint(t: number, optionalTarget = new Vector3()) {
        t = this.start + t * (this.end - this.start);
        const tx = t;
        const ty = 0;
        const tz = perlinCurveSampler({ x: t, ySample: this.stretch * this.s, shift: this.shift * this.s, amplitude: this.amplitude, perlin: this.perlin });

        const R = new Matrix3(
            Math.cos(this.theta), 0, Math.sin(this.theta),
            0, 1, 0,
            -Math.sin(this.theta), 0, Math.cos(this.theta));
        return optionalTarget.set(tx, ty, tz).applyMatrix3(R).multiplyScalar(this.scale);
    }
}

export class PerlinCurveRising extends PerlinCurve {
    constructor({ ySample = 0, shift = 0, amplitude = 1, scale = 1, start = 0, end = 1, perlin = new Noise(), theta = 0 }: { ySample?: number, shift?: number, amplitude?: number, scale?: number, start?: number, end?: number, theta?: number, perlin?: Noise; }) {
        super({
            ySample,
            shift,
            amplitude,
            scale,
            start,
            end,
            theta,
            perlin
        });
    }

    getPoint(t: number, optionalTarget = new Vector3()) {
        return super.getPoint(t, optionalTarget).add(new Vector3(0, 0, - .1 * (this.start + t * (this.end - this.start))));
    }
}

export class CurveBasisVectorAtPoint<TCurve extends Curve<Vector3>> extends Vector {
    curve: Curve<Vector3>;
    norm: number;
    constructor(at: Vector3, curve: TCurve, norm: number, c: string, color: number = 0x808080) {
        let [P, T] = closestPointToPoint(at, curve, 0.0001);
        super(at, curve.getTangentAt(T).normalize().multiplyScalar(norm), c, color);
        this.curve = curve;
        this.norm = norm;
    }

    setVector(at: Vector3) {
        this.at = at;
        let [P, T] = closestPointToPoint(at, this.curve, 0.0001);
        return super.setVector(at, this.curve.getTangentAt(T).normalize().multiplyScalar(this.norm));
    };
}

export class PerlinGridLineAtPoint extends Mesh {
    curve: PerlinCurveAtPoint;
    constructor(point: Vector3, stretch: number, shift: number, perlin: Noise, theta = 0) {
        let mat = new MeshBasicMaterial({ color: 0x4a4a4a });
        let _curve = new PerlinCurveAtPoint({ start: -20, end: 20, point, stretch, shift, perlin, theta });
        super(new TubeGeometry(_curve, 1000, 0.01, 15, false), mat);
        this.curve = _curve;
        this.position.setY(.01);
    }

    setPoint(point: Vector3) {
        this.curve.point = point;
        this.geometry = new TubeGeometry(this.curve, 1000, 0.01, 15, false);
    }
}