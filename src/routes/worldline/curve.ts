import { Vector2, Vector3 } from "three";

// Simple 1D Perlin noise implementation
function noise(x: number) {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);
    const fade = x * x * x * (x * (x * 6 - 15) + 10);

    // Simple hash function
    const hash = (n: number) => {
        let x = Math.sin(n) * 43758.5453123;
        return x - Math.floor(x);
    };

    const a = hash(X);
    const b = hash(X + 1);
    return (1 - fade) * a + fade * b;
}

export function generateFlowingCurve2D(numPoints = 100, complexity = 0.02, amplitude = 100, phase: number, size: number = .01, stretch: number = 2) {
    const points: number[] = [];

    for (let i = -numPoints; i < numPoints; i++) {
        points.push(
            stretch * size * i * 5,
            0,
            size * amplitude * noise(i * complexity + phase),
        );
    }

    return points;
}

export function generateFlowingCurve3D(numPoints = 100, complexity = 0.02, amplitude = 100) {
    const points = [];
    // Different phase offsets for each dimension to create varied movement
    const phaseX = Math.random() * 1000;
    const phaseY = Math.random() * 1000;
    const phaseZ = Math.random() * 1000;

    for (let i = 0; i < numPoints; i++) {
        points.push(
            amplitude * noise(i * complexity + phaseX),
            amplitude * noise(i * complexity + phaseY),
            amplitude * noise(i * complexity + phaseZ));
    }

    return points;
}

/**
 * Finds the closest point on a 3D curve to a given point
 * @param {number[]} point - Array of [x, y, z] coordinates
 * @param {number[]} curve - Flat array of curve points [x1,y1,z1,x2,y2,z2,...]
 * @returns {number[]} Closest point on curve [x, y, z]
 */
export function findClosestPointOnCurve(point, curve): { p: [number, number, number], i: number; } {
    if (curve.length === 0 || curve.length % 3 !== 0) {
        throw new Error('Curve array must contain complete 3D points (multiple of 3)');
    }

    let closestPoint: [number, number, number] = [curve[0], curve[1], curve[2]];
    let closestIndex: number = 0;
    let minDistance = Infinity;

    // Iterate through curve points
    for (let i = 0; i < curve.length; i += 3) {
        const curvePoint = [curve[i], curve[i + 1], curve[i + 2]];
        const distance = calculateDistance(point, curvePoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = curvePoint;
            closestIndex = i;
        }
    }

    return { p: closestPoint, i: closestIndex };
}

/**
 * Calculates Euclidean distance between two 3D points
 * @param {number[]} p1 - First point [x, y, z]
 * @param {number[]} p2 - Second point [x, y, z]
 * @returns {number} Distance between points
 */
function calculateDistance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    const dz = p1[2] - p2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function splitArray(array, n): number[][] {
    // Handle edge cases
    if (n <= 0) return [];
    if (n === 1) return [array];

    const result = [];
    const length = array.length;
    const pieceSize = Math.ceil(length / n);

    for (let i = 0; i < length; i += pieceSize) {
        result.push(array.slice(i, i + pieceSize));
    }

    return result;
}

export function normalizeDeviceSpace(vector: Vector3, width: number, height: number): Vector2 {
    var v = new Vector2((vector.x + 1) * width / 2, - (vector.y - 1) * height / 2);
    var margin = 40;
    if (v.x >= width - margin || v.y >= height - margin)
        v = new Vector2(0, 0);
    return v;
};