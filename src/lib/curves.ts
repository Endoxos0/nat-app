import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { Group, SphereGeometry, MeshBasicMaterial, Mesh, Color, Vector2 } from "three";

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
