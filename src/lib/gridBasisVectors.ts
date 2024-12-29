import { Vector2 } from "three";
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
export function findParameterForPoint(f: (x: number, q: number) => number, p: Vector2, qMin: number, qMax: number, tolerance = 1e-10, maxIterations = 1000) {
    let iterations = 0;

    while (iterations < maxIterations) {
        const qMid = (qMin + qMax) / 2;
        const yAtMid = f(p.x, qMid);
        const error = Math.abs(yAtMid - p.y);

        // Check if we found a solution within tolerance
        if (error <= tolerance) {
            return qMid;
        }

        // Adjust search interval based on whether we need to increase or decrease q
        if (yAtMid < p.y) {
            qMin = qMid;
        } else {
            qMax = qMid;
        }

        iterations++;
    }

    // If we couldn't find a solution within maxIterations
    return null;
}