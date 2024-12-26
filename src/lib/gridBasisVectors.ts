import type { Vector3 } from "three";
import { Noise, perlinCurve, perlinCurveP, perlinCurveSampler } from "./perlinNoise";

/**
 * Finds the parameter q such that point P(x,y) lies on function f(x,q)
 * Uses binary search to minimize |f(x,q) - y|
 * 
 * @param {Function} f - Function f(x,q) that takes x and parameter q
 * @param {number} px - x-coordinate of point P
 * @param {number} py - y-coordinate of point P
 * @param {number} qMin - Lower bound for parameter q search
 * @param {number} qMax - Upper bound for parameter q search
 * @param {number} tolerance - Acceptable error margin (default: 1e-10)
 * @param {number} maxIterations - Maximum iterations (default: 1000)
 * @returns {number|null} Parameter q or null if no solution found
 */
export function findParameterForPoint(f: (x: number, q: number) => number, px: number, py: number, qMin: number, qMax: number, tolerance = 1e-10, maxIterations = 1000) {
    let iterations = 0;

    while (iterations < maxIterations) {
        const qMid = (qMin + qMax) / 2;
        const yAtMid = f(px, qMid);
        const error = Math.abs(yAtMid - py);

        // Check if we found a solution within tolerance
        if (error <= tolerance) {
            return qMid;
        }

        // Adjust search interval based on whether we need to increase or decrease q
        if (yAtMid < py) {
            qMin = qMid;
        } else {
            qMax = qMid;
        }

        iterations++;
    }

    // If we couldn't find a solution within maxIterations
    return null;
}

export function perlinGridLine({ P, shift, stretch, perlin }: { P: Vector3; shift: number, stretch: number, perlin: Noise; }) {
    let S = findParameterForPoint(
        (x, q) => perlinCurveSampler({ x, ySample: stretch * q, shift: shift * q, perlin }),
        P.x,
        P.z, -50, 50, 1e-10, 10000) as number;
    return perlinCurve({ N: 20, delta: 0.01, ySample: stretch * S, shift: shift * S, perlin, });
}


export function perlinGridLineP({ P, shift, stretch, perlin }: { P: Vector3; shift: number, stretch: number, perlin: Noise; }) {
    let S = findParameterForPoint(
        (x, q) => perlinCurveSampler({ x, ySample: stretch * q, shift: shift * q, perlin }),
        P.z,
        P.x, -50, 50, 1e-10, 10000) as number;
    return perlinCurveP({ N: 20, delta: 0.01, ySample: stretch * S, shift: shift * S, perlin, });
}

