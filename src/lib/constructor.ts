export type Constructor<T> = { new(...args: any[]): T; };

export abstract class CustomScene {
    CssDomElement: HTMLElement;
    WebGLDomElement: HTMLElement;
    constructor(CssDomElement: HTMLElement, WebGLDomElement: HTMLElement) {
        this.CssDomElement = CssDomElement;
        this.WebGLDomElement = WebGLDomElement;
    }

    abstract start(): void;
    abstract stop(): void;
}
