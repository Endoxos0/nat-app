

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.8uB8-6s6.js","_app/immutable/chunks/disclose-version.D9huDNME.js","_app/immutable/chunks/runtime.C3cYoo1m.js","_app/immutable/chunks/legacy.BsL9S39k.js"];
export const stylesheets = [];
export const fonts = [];
