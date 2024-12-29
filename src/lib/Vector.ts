import { Vector3, Mesh, ConeGeometry, MeshBasicMaterial, Quaternion, Group, Matrix3, LineCurve3, TubeGeometry } from 'three';
import { symbolOf } from './symbol';

export function decompose(v: Vector3, e0 = new Vector3(1, 0, 0), e1 = new Vector3(0, 1, 0), e2 = new Vector3(0, 0, 1)) {
    let M = new Matrix3(
        e0.x, e1.x, e2.x,
        e0.y, e1.y, e2.y,
        e0.z, e1.z, e2.z,
    );
    return v.clone().applyMatrix3(M.invert());
}

export class Vector extends Group {
    line;
    line_geometry;
    line_mesh;
    coneGeometry;
    cone;
    symbol;
    at;
    vector;
    c;
    color;
    symbolOffset;

    radius = 0.03;

    offsetScale = .4;

    constructor(at: Vector3, vector: Vector3, c: string, color: number, symbolOffset: number = 0) {
        super();
        this.position.setY(.1);
        this.at = at;
        this.vector = vector;
        this.c = c;
        this.color = color;
        this.symbolOffset = symbolOffset;

        const mat = new MeshBasicMaterial({ color: color });
        const V = at.clone().add(this.vector);
        this.line = new LineCurve3(at, V);
        this.line_geometry = new TubeGeometry(this.line, 1000, this.radius, 15, false);
        this.line_mesh = new Mesh(this.line_geometry, mat);
        this.add(this.line_mesh);

        this.coneGeometry = new ConeGeometry(.09, .3, 32);
        this.cone = new Mesh(this.coneGeometry, mat);
        this.cone.position.copy(V);
        const quaternion = new Quaternion();
        const start = new Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(start, this.vector.clone().normalize());
        this.cone.setRotationFromQuaternion(quaternion);
        this.add(this.cone);

        let offset: Vector3;
        if (this.symbolOffset != 0)
            offset = new Vector3(0, 0, -.7);
        else
            offset = this.vector.clone().normalize().multiplyScalar(this.offsetScale);
        this.symbol = symbolOf({ c });
        // this.symbol.layers.set(1);
        this.symbol.rotateX(-Math.PI / 2);
        this.symbol.position.copy(V).add(offset).add(this.vector.clone().multiplyScalar(this.symbolOffset));
        this.add(this.symbol);
    }

    setVector(at: Vector3, vector: Vector3) {
        this.at = at;
        this.vector = vector;
        const V = at.clone().add(vector);
        this.line.v1 = at;
        this.line.v2 = V;
        this.line_geometry = new TubeGeometry(this.line, 1000, this.radius, 15, false);
        this.line_mesh.geometry = this.line_geometry;

        this.cone.position.copy(V);
        const quaternion = new Quaternion();
        const start = new Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(start, this.vector.clone().normalize());
        this.cone.setRotationFromQuaternion(quaternion);

        let offset: Vector3;
        if (this.symbolOffset != 0)
            offset = new Vector3(0, 0, -.7);
        else
            offset = this.vector.clone().normalize().multiplyScalar(this.offsetScale);
        this.symbol.position.copy(V).add(offset).add(this.vector.clone().multiplyScalar(this.symbolOffset));
        return this;
    };

    scaleVector(scalar: number) {
        const V = this.at.clone().add(this.vector.multiplyScalar(scalar));
        this.line.v2 = V;
        this.line_geometry = new TubeGeometry(this.line, 1000, 0.01, 15, false);
        this.line_mesh.geometry = this.line_geometry;

        this.cone.position.copy(V);
        const quaternion = new Quaternion();
        const start = new Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(start, this.vector.clone().normalize());
        this.cone.setRotationFromQuaternion(quaternion);

        let offset: Vector3;
        if (this.symbolOffset != 0)
            offset = new Vector3(0, 0, -.7);
        else
            offset = this.vector.clone().normalize().multiplyScalar(this.offsetScale);
        this.symbol.position.copy(V).add(offset).add(this.vector.clone().multiplyScalar(this.symbolOffset));

        return this;
    };
}