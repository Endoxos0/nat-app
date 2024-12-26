import katex from "katex";
import { Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";

export function symbolOf({ c, scale = 0.02 }: { c: string, scale?: number; }) {
    const symbol = document.createElement('div');
    symbol.innerHTML = katex.renderToString(c);
    const objectCSS = new CSS3DObject(symbol);
    objectCSS.scale.set(scale, scale, scale);
    return objectCSS;
}