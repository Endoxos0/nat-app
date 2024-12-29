import { TubeGeometry, Mesh, MeshBasicMaterial, SphereGeometry, Curve, Vector3 } from "three";
import { CircleCurve, closestPointToPoint } from "./curves";

export class CurveParameter extends Mesh {
    T: number = 0;
    constructor(radius: number) {
        super();
        const material = new MeshBasicMaterial({ color: 0xFFFFFF });
        const circle_geometry = new TubeGeometry(new CircleCurve(1, radius), 1000, 0.01, 15, false);
        const parameterSphere = new Mesh(circle_geometry, material);

        this.geometry = new SphereGeometry(radius + 0.1, 50, 50);
        const inner_material = new MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0 });
        this.material = inner_material;
        this.add(parameterSphere);
    }

    restrictToCurve<TCurve extends Curve<Vector3>>(curve: TCurve) {
        let [point, T] = closestPointToPoint(this.position, curve, 0.0001);
        this.T = T;
        this.position.copy(point);
    }
}