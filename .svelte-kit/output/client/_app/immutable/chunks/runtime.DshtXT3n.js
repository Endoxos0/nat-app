var Dn=Array.isArray,On=Array.from,Nn=Object.defineProperty,_t=Object.getOwnPropertyDescriptor,Kt=Object.getOwnPropertyDescriptors,In=Object.prototype,Pn=Array.prototype,$t=Object.getPrototypeOf;const bn=()=>{};function Cn(t){return t()}function Zt(t){for(var r=0;r<t.length;r++)t[r]()}const E=2,dt=4,Z=8,st=16,T=32,W=64,tt=128,O=256,V=512,y=1024,x=2048,M=4096,b=8192,C=16384,Wt=32768,yt=65536,Fn=1<<17,zt=1<<19,Et=1<<20,ct=Symbol("$state"),qn=Symbol("legacy props");function wt(t){return t===this.v}function Jt(t,r){return t!=t?r==r:t!==r||t!==null&&typeof t=="object"||typeof t=="function"}function mt(t){return!Jt(t,this.v)}function Qt(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function Xt(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function tn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function nn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Ln(){throw new Error("https://svelte.dev/e/hydration_failed")}function Yn(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Mn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function jn(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function rn(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function en(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let z=!1;function Un(){z=!0}const Hn=1,Bn=2,Vn=4,Gn=8,Kn=16,$n=1,Zn=2,ln="[",sn="[!",un="]",Tt={},Wn=Symbol();function ut(t,r){var n={f:0,v:t,reactions:null,equals:wt,version:0};return n}function zn(t){return on(ut(t))}function Jn(t,r=!1){var e;const n=ut(t);return r||(n.equals=mt),z&&f!==null&&f.l!==null&&((e=f.l).s??(e.s=[])).push(n),n}function on(t){return a!==null&&a.f&E&&(m===null?mn([t]):m.push(t)),t}function Qn(t,r){return a!==null&&it()&&a.f&(E|st)&&(m===null||!m.includes(t))&&en(),an(t,r)}function an(t,r){return t.equals(r)||(t.v=r,t.version=jt(),gt(t,x),it()&&o!==null&&o.f&y&&!(o.f&T)&&(v!==null&&v.includes(t)?(g(o,x),X(o)):A===null?Tn([t]):A.push(t))),r}function gt(t,r){var n=t.reactions;if(n!==null)for(var e=it(),l=n.length,s=0;s<l;s++){var u=n[s],i=u.f;i&x||!e&&u===o||(g(u,r),i&(y|O)&&(i&E?gt(u,M):X(u)))}}function At(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let k=!1;function Xn(t){k=t}let w;function F(t){if(t===null)throw At(),Tt;return w=t}function tr(){return F(N(w))}function nr(t){if(k){if(N(w)!==null)throw At(),Tt;w=t}}function rr(t=1){if(k){for(var r=t,n=w;r--;)n=N(n);w=n}}function er(){for(var t=0,r=w;;){if(r.nodeType===8){var n=r.data;if(n===un){if(t===0)return r;t-=1}else(n===ln||n===sn)&&(t+=1)}var e=N(r);r.remove(),r=e}}var vt,xt,Rt;function lr(){if(vt===void 0){vt=window;var t=Element.prototype,r=Node.prototype;xt=_t(r,"firstChild").get,Rt=_t(r,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function nt(t=""){return document.createTextNode(t)}function rt(t){return xt.call(t)}function N(t){return Rt.call(t)}function sr(t,r){if(!k)return rt(t);var n=rt(w);if(n===null)n=w.appendChild(nt());else if(r&&n.nodeType!==3){var e=nt();return n==null||n.before(e),F(e),e}return F(n),n}function ur(t,r){if(!k){var n=rt(t);return n instanceof Comment&&n.data===""?N(n):n}return w}function or(t,r=1,n=!1){let e=k?w:t;for(var l;r--;)l=e,e=N(e);if(!k)return e;var s=e==null?void 0:e.nodeType;if(n&&s!==3){var u=nt();return e===null?l==null||l.after(u):e.before(u),F(u),u}return F(e),e}function ar(t){t.textContent=""}function fn(t){var r=E|x;o===null?r|=O:o.f|=Et;var n=a!==null&&a.f&E?a:null;const e={children:null,ctx:f,deps:null,equals:wt,f:r,fn:t,reactions:null,v:null,version:0,parent:n??o};return n!==null&&(n.children??(n.children=[])).push(e),e}function ir(t){const r=fn(t);return r.equals=mt,r}function St(t){var r=t.children;if(r!==null){t.children=null;for(var n=0;n<r.length;n+=1){var e=r[n];e.f&E?ot(e):D(e)}}}function _n(t){for(var r=t.parent;r!==null;){if(!(r.f&E))return r;r=r.parent}return null}function kt(t){var r,n=o;$(_n(t));try{St(t),r=Ut(t)}finally{$(n)}return r}function Dt(t){var r=kt(t),n=(S||t.f&O)&&t.deps!==null?M:y;g(t,n),t.equals(r)||(t.v=r,t.version=jt())}function ot(t){St(t),Y(t,0),g(t,C),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Ot(t){o===null&&a===null&&tn(),a!==null&&a.f&O&&Xt(),at&&Qt()}function cn(t,r){var n=r.last;n===null?r.last=r.first=t:(n.next=t,t.prev=n,r.last=t)}function j(t,r,n,e=!0){var l=(t&W)!==0,s=o,u={ctx:f,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|x,first:null,fn:r,last:null,next:null,parent:l?null:s,prev:null,teardown:null,transitions:null,version:0};if(n){var i=I;try{pt(!0),Q(u),u.f|=Wt}catch(_){throw D(u),_}finally{pt(i)}}else r!==null&&X(u);var p=n&&u.deps===null&&u.first===null&&u.nodes_start===null&&u.teardown===null&&(u.f&Et)===0;if(!p&&!l&&e&&(s!==null&&cn(u,s),a!==null&&a.f&E)){var h=a;(h.children??(h.children=[])).push(u)}return u}function fr(t){Ot();var r=o!==null&&(o.f&T)!==0&&f!==null&&!f.m;if(r){var n=f;(n.e??(n.e=[])).push({fn:t,effect:o,reaction:a})}else{var e=Nt(t);return e}}function _r(t){return Ot(),vn(t)}function cr(t){const r=j(W,t,!0);return(n={})=>new Promise(e=>{n.outro?dn(r,()=>{D(r),e(void 0)}):(D(r),e(void 0))})}function Nt(t){return j(dt,t,!1)}function vn(t){return j(Z,t,!0)}function vr(t){return pn(t)}function pn(t,r=0){return j(Z|st|r,t,!0)}function pr(t,r=!0){return j(Z|T,t,!0,r)}function It(t){var r=t.teardown;if(r!==null){const n=at,e=a;ht(!0),K(null);try{r.call(null)}finally{ht(n),K(e)}}}function Pt(t){var r=t.deriveds;if(r!==null){t.deriveds=null;for(var n=0;n<r.length;n+=1)ot(r[n])}}function bt(t,r=!1){var n=t.first;for(t.first=t.last=null;n!==null;){var e=n.next;D(n,r),n=e}}function hn(t){for(var r=t.first;r!==null;){var n=r.next;r.f&T||D(r),r=n}}function D(t,r=!0){var n=!1;if((r||t.f&zt)&&t.nodes_start!==null){for(var e=t.nodes_start,l=t.nodes_end;e!==null;){var s=e===l?null:N(e);e.remove(),e=s}n=!0}bt(t,r&&!n),Pt(t),Y(t,0),g(t,C);var u=t.transitions;if(u!==null)for(const p of u)p.stop();It(t);var i=t.parent;i!==null&&i.first!==null&&Ct(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Ct(t){var r=t.parent,n=t.prev,e=t.next;n!==null&&(n.next=e),e!==null&&(e.prev=n),r!==null&&(r.first===t&&(r.first=e),r.last===t&&(r.last=n))}function dn(t,r){var n=[];Ft(t,n,!0),yn(n,()=>{D(t),r&&r()})}function yn(t,r){var n=t.length;if(n>0){var e=()=>--n||r();for(var l of t)l.out(e)}else r()}function Ft(t,r,n){if(!(t.f&b)){if(t.f^=b,t.transitions!==null)for(const u of t.transitions)(u.is_global||n)&&r.push(u);for(var e=t.first;e!==null;){var l=e.next,s=(e.f&yt)!==0||(e.f&T)!==0;Ft(e,r,s?n:!1),e=l}}}function hr(t){qt(t,!0)}function qt(t,r){if(t.f&b){U(t)&&Q(t),t.f^=b;for(var n=t.first;n!==null;){var e=n.next,l=(n.f&yt)!==0||(n.f&T)!==0;qt(n,l?r:!1),n=e}if(t.transitions!==null)for(const s of t.transitions)(s.is_global||r)&&s.in()}}let G=!1,et=[];function Lt(){G=!1;const t=et.slice();et=[],Zt(t)}function dr(t){G||(G=!0,queueMicrotask(Lt)),et.push(t)}function En(){G&&Lt()}const Yt=0,wn=1;let H=!1,B=Yt,q=!1,L=null,I=!1,at=!1;function pt(t){I=t}function ht(t){at=t}let R=[],P=0;let a=null;function K(t){a=t}let o=null;function $(t){o=t}let m=null;function mn(t){m=t}let v=null,d=0,A=null;function Tn(t){A=t}let Mt=1,S=!1,f=null;function jt(){return++Mt}function it(){return!z||f!==null&&f.l===null}function U(t){var u,i;var r=t.f;if(r&x)return!0;if(r&M){var n=t.deps,e=(r&O)!==0;if(n!==null){var l;if(r&V){for(l=0;l<n.length;l++)((u=n[l]).reactions??(u.reactions=[])).push(t);t.f^=V}for(l=0;l<n.length;l++){var s=n[l];if(U(s)&&Dt(s),e&&o!==null&&!S&&!((i=s==null?void 0:s.reactions)!=null&&i.includes(t))&&(s.reactions??(s.reactions=[])).push(t),s.version>t.version)return!0}}(!e||o!==null&&!S)&&g(t,y)}return!1}function gn(t,r){for(var n=r;n!==null;){if(n.f&tt)try{n.fn(t);return}catch{n.f^=tt}n=n.parent}throw H=!1,t}function An(t){return(t.f&C)===0&&(t.parent===null||(t.parent.f&tt)===0)}function J(t,r,n,e){if(H){if(n===null&&(H=!1),An(r))throw t;return}n!==null&&(H=!0);{gn(t,r);return}}function Ut(t){var ft;var r=v,n=d,e=A,l=a,s=S,u=m,i=f,p=t.f;v=null,d=0,A=null,a=p&(T|W)?null:t,S=!I&&(p&O)!==0,m=null,f=t.ctx;try{var h=(0,t.fn)(),_=t.deps;if(v!==null){var c;if(Y(t,d),_!==null&&d>0)for(_.length=d+v.length,c=0;c<v.length;c++)_[d+c]=v[c];else t.deps=_=v;if(!S)for(c=d;c<_.length;c++)((ft=_[c]).reactions??(ft.reactions=[])).push(t)}else _!==null&&d<_.length&&(Y(t,d),_.length=d);return h}finally{v=r,d=n,A=e,a=l,S=s,m=u,f=i}}function xn(t,r){let n=r.reactions;if(n!==null){var e=n.indexOf(t);if(e!==-1){var l=n.length-1;l===0?n=r.reactions=null:(n[e]=n[l],n.pop())}}n===null&&r.f&E&&(v===null||!v.includes(r))&&(g(r,M),r.f&(O|V)||(r.f^=V),Y(r,0))}function Y(t,r){var n=t.deps;if(n!==null)for(var e=r;e<n.length;e++)xn(t,n[e])}function Q(t){var r=t.f;if(!(r&C)){g(t,y);var n=o,e=f;o=t;try{r&st?hn(t):bt(t),Pt(t),It(t);var l=Ut(t);t.teardown=typeof l=="function"?l:null,t.version=Mt}catch(s){J(s,t,n,e||t.ctx)}finally{o=n}}}function Ht(){if(P>1e3){P=0;try{nn()}catch(t){if(L!==null)J(t,L,null);else throw t}}P++}function Bt(t){var r=t.length;if(r!==0){Ht();var n=I;I=!0;try{for(var e=0;e<r;e++){var l=t[e];l.f&y||(l.f^=y);var s=[];Vt(l,s),Rn(s)}}finally{I=n}}}function Rn(t){var r=t.length;if(r!==0)for(var n=0;n<r;n++){var e=t[n];if(!(e.f&(C|b)))try{U(e)&&(Q(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Ct(e):e.fn=null))}catch(l){J(l,e,null,e.ctx)}}}function Sn(){if(q=!1,P>1001)return;const t=R;R=[],Bt(t),q||(P=0,L=null)}function X(t){B===Yt&&(q||(q=!0,queueMicrotask(Sn))),L=t;for(var r=t;r.parent!==null;){r=r.parent;var n=r.f;if(n&(W|T)){if(!(n&y))return;r.f^=y}}R.push(r)}function Vt(t,r){var n=t.first,e=[];t:for(;n!==null;){var l=n.f,s=(l&T)!==0,u=s&&(l&y)!==0,i=n.next;if(!u&&!(l&b))if(l&Z){if(s)n.f^=y;else try{U(n)&&Q(n)}catch(c){J(c,n,null,n.ctx)}var p=n.first;if(p!==null){n=p;continue}}else l&dt&&e.push(n);if(i===null){let c=n.parent;for(;c!==null;){if(t===c)break t;var h=c.next;if(h!==null){n=h;continue t}c=c.parent}}n=i}for(var _=0;_<e.length;_++)p=e[_],r.push(p),Vt(p,r)}function Gt(t){var r=B,n=R;try{Ht();const l=[];B=wn,R=l,q=!1,Bt(n);var e=t==null?void 0:t();return En(),(R.length>0||l.length>0)&&Gt(),P=0,L=null,e}finally{B=r,R=n}}async function yr(){await Promise.resolve(),Gt()}function Er(t){var _;var r=t.f,n=(r&E)!==0;if(n&&r&C){var e=kt(t);return ot(t),e}if(a!==null){m!==null&&m.includes(t)&&rn();var l=a.deps;v===null&&l!==null&&l[d]===t?d++:v===null?v=[t]:v.push(t),A!==null&&o!==null&&o.f&y&&!(o.f&T)&&A.includes(t)&&(g(o,x),X(o))}else if(n&&t.deps===null)for(var s=t,u=s.parent,i=s;u!==null;)if(u.f&E){var p=u;i=p,u=p.parent}else{var h=u;(_=h.deriveds)!=null&&_.includes(i)||(h.deriveds??(h.deriveds=[])).push(i);break}return n&&(s=t,U(s)&&Dt(s)),t.v}function wr(t){const r=a;try{return a=null,t()}finally{a=r}}const kn=~(x|M|y);function g(t,r){t.f=t.f&kn|r}function mr(t,r=!1,n){f={p:f,c:null,e:null,m:!1,s:t,x:null,l:null},z&&!r&&(f.l={s:null,u:null,r1:[],r2:ut(!1)})}function Tr(t){const r=f;if(r!==null){const u=r.e;if(u!==null){var n=o,e=a;r.e=null;try{for(var l=0;l<u.length;l++){var s=u[l];$(s.effect),K(s.reaction),Nt(s.fn)}}finally{$(n),K(e)}}f=r.p,r.m=!0}return{}}function gr(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(ct in t)lt(t);else if(!Array.isArray(t))for(let r in t){const n=t[r];typeof n=="object"&&n&&ct in n&&lt(n)}}}function lt(t,r=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!r.has(t)){r.add(t),t instanceof Date&&t.getTime();for(let e in t)try{lt(t[e],r)}catch{}const n=$t(t);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const e=Kt(n);for(let l in e){const s=e[l].get;if(s)try{s.call(t)}catch{}}}}}export{Mn as $,F as A,tr as B,un as C,At as D,yt as E,Ln as F,ar as G,ln as H,On as I,cr as J,nt as K,_r as L,Zt as M,Er as N,Cn as O,gr as P,fn as Q,vr as R,sr as S,nr as T,or as U,$n as V,Zn as W,ct as X,In as Y,Pn as Z,ut as _,pr as a,Qn as a0,_t as a1,Wn as a2,jn as a3,$t as a4,sn as a5,er as a6,hr as a7,dn as a8,Nt as a9,vn as aa,dr as ab,Yn as ac,Fn as ad,Vn as ae,mt as af,T as ag,W as ah,Hn as ai,Bn as aj,Gn as ak,qn as al,ir as am,Jn as an,Kn as ao,Gt as ap,yr as aq,zn as ar,Jt as as,pn as b,bn as c,D as d,Un as e,w as f,ur as g,k as h,Tr as i,f as j,wr as k,z as l,Nn as m,rr as n,$ as o,mr as p,Dn as q,a as r,K as s,o as t,fr as u,lr as v,rt as w,N as x,Tt as y,Xn as z};
