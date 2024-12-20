

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D1g3vSw3.js","_app/immutable/chunks/disclose-version.CM_ElYc5.js","_app/immutable/chunks/runtime.DshtXT3n.js","_app/immutable/chunks/legacy.Cgp-lv3b.js"];
export const stylesheets = [];
export const fonts = [];
