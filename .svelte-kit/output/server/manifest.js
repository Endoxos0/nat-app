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
		client: {"start":"_app/immutable/entry/start.Df2cfm4T.js","app":"_app/immutable/entry/app.CcwBtDo1.js","imports":["_app/immutable/entry/start.Df2cfm4T.js","_app/immutable/chunks/entry.B-VCY6_m.js","_app/immutable/chunks/runtime.DshtXT3n.js","_app/immutable/chunks/index-client.CcjcZ_Ya.js","_app/immutable/entry/app.CcwBtDo1.js","_app/immutable/chunks/runtime.DshtXT3n.js","_app/immutable/chunks/render.CZV3ej5i.js","_app/immutable/chunks/disclose-version.CM_ElYc5.js","_app/immutable/chunks/index-client.CcjcZ_Ya.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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