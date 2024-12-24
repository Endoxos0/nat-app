export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".nojekyll","favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.CVAyCmqw.js","app":"_app/immutable/entry/app.CR_HTelZ.js","imports":["_app/immutable/entry/start.CVAyCmqw.js","_app/immutable/chunks/entry.bQtIOgHV.js","_app/immutable/chunks/runtime.C3cYoo1m.js","_app/immutable/chunks/index-client.BLzj2XlN.js","_app/immutable/entry/app.CR_HTelZ.js","_app/immutable/chunks/runtime.C3cYoo1m.js","_app/immutable/chunks/render.CvbnjDgI.js","_app/immutable/chunks/disclose-version.D9huDNME.js","_app/immutable/chunks/index-client.BLzj2XlN.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
