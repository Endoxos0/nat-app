import { TubeGeometry, Mesh, MeshBasicMaterial, SphereGeometry, PolarGridHelper } from "three";
import { CircleCurve } from "./curves";

export function CircleParameterPointer(radius = 1) {
    const material = new MeshBasicMaterial({ color: 0xFFFFFF });
    const circle_geometry = new TubeGeometry(new CircleCurve(1, radius), 1000, 0.01, 15, false);
    const parameterSphere = new Mesh(circle_geometry, material);

    const geometry = new SphereGeometry(radius + 0.1, 50, 50);
    const inner_material = new MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0 });
    const sphere = new Mesh(geometry, inner_material);
    sphere.add(parameterSphere);

    return sphere;
}