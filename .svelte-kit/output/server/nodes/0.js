

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.B6l91n49.js","_app/immutable/chunks/disclose-version.CM_ElYc5.js","_app/immutable/chunks/runtime.DshtXT3n.js"];
export const stylesheets = [];
export const fonts = [];
