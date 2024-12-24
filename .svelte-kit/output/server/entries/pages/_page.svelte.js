import { e as escape_html } from "../../chunks/escaping.js";
import { c as pop, p as push } from "../../chunks/index.js";
import katex from "katex";
function _page($$payload, $$props) {
  push();
  const html = katex.renderToString("\\ce{CO2 + C -> 2 C0}");
  $$payload.out += `<h1>Donkere Materie</h1> <p>${escape_html(html)}</p> <iframe width="1519" height="607" src="https://www.youtube.com/embed/j1_MrnDEL1M" title="voorstel natuurkunde" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  pop();
}
export {
  _page as default
};
