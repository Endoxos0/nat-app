

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.N-9cDMjF.js","_app/immutable/chunks/disclose-version.D9huDNME.js","_app/immutable/chunks/runtime.C3cYoo1m.js"];
export const stylesheets = [];
export const fonts = [];
