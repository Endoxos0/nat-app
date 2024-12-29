import { PlaneGeometry, MeshPhongMaterial, DoubleSide, Mesh } from "three";
import { WireframeGeometry, LineSegments } from 'three';

export class Noise {
    p: Uint8Array<ArrayBuffer>;
    constructor() {
        this.p = new Uint8Array(512);
        for (let i = 0; i < 256; i++) this.p[i] = i;

        let n;
        for (let i = 255; i > 0; i--) {
            n = Math.floor((i + 1) * Math.random());
            [this.p[i], this.p[n]] = [this.p[n], this.p[i]];
        }

        for (let i = 0; i < 256; i++) {
            this.p[i + 256] = this.p[i];
        }
    }

    fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t: number, a: number, b: number) {
        return a + t * (b - a);
    }

    grad(hash: number, x: number, y: number, z: number) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x: number, y: number, z: number) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        return this.lerp(w,
            this.lerp(v,
                this.lerp(u,
                    this.grad(this.p[AA], x, y, z),
                    this.grad(this.p[BA], x - 1, y, z)
                ),
                this.lerp(u,
                    this.grad(this.p[AB], x, y - 1, z),
                    this.grad(this.p[BB], x - 1, y - 1, z)
                )
            ),
            this.lerp(v,
                this.lerp(u,
                    this.grad(this.p[AA + 1], x, y, z - 1),
                    this.grad(this.p[BA + 1], x - 1, y, z - 1)
                ),
                this.lerp(u,
                    this.grad(this.p[AB + 1], x, y - 1, z - 1),
                    this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)
                )
            )
        );
    }
}

export function perlinCurveSampler({ x, ySample, shift, amplitude = 1, perlin }: { x: number, ySample: number, shift: number, amplitude?: number, perlin: Noise; }) {
    return shift + amplitude * perlin.noise(0.3 * x, ySample, 0);
}

export function perlinCurve({ N, delta = 0.01, ySample = 0, shift = 0, perlin = new Noise(), amplitude = 1 }: { N: number, delta?: number, ySample?: number, shift?: number, amplitude?: number, perlin?: Noise; }) {
    const samples: number[] = [];

    for (let i = -N; i < N; i += delta) {
        samples.push(
            i,
            0,
            perlinCurveSampler({ x: i, ySample, shift, amplitude, perlin }),
        );
    }
    return samples;
}

export function perlinCurveP({ N, delta = 0.01, ySample = 0, shift = 0, perlin = new Noise(), amplitude = 1 }: { N: number, delta?: number, ySample?: number, shift?: number, perlin?: Noise, amplitude?: number; }) {
    const samples: number[] = [];

    for (let i = -N; i < N; i += delta) {
        samples.push(
            perlinCurveSampler({ x: i, ySample, shift, amplitude, perlin }),
            0,
            i,
        );
    }
    return samples;
}

export function perlinSurface(perlin: Noise = new Noise()) {
    // Create surface geometry
    const geometry = new PlaneGeometry(100, 100, 100, 100);
    const material = new MeshPhongMaterial({
        color: 0x44aa88,
        wireframe: false,
        side: DoubleSide,
    });

    // Generate Perlin noise
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i] / 10;
        const z = positions[i + 1] / 10;
        positions[i + 2] = perlin.noise(x, z, 0) * 5;
    }

    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 1);
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;

    let s = .2;
    mesh.scale.set(s, s, s);

    const wireframe = new WireframeGeometry((geometry));

    const line = new LineSegments(wireframe);
    // line.material.depthTest = false;
    // line.material.opacity = 0.25;
    // line.material.transparent = true;

    line.rotation.x = -Math.PI / 2;
    // line.scale.set(s, s, s);

    return line;
}