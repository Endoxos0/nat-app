import katex from "katex";

const LaTeX = katex.renderToString;
export const EFE = LaTeX("G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}");
export const KeplerThirdLaw = LaTeX("\\frac{r^3}{T^2}=\\frac{GM}{4\\pi^2}");
export const TproptoR = LaTeX("T^2\\!\\propto\\!r^3");
export const c = LaTeX("c");
export const gravitationalConstant = LaTeX("G");
export const LaplacianFull = LaTeX("\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2}");
export const Poissons = LaTeX("\\nabla^2\\Phi = 4\\pi G\\rho");
export const Laplacian = LaTeX("\\nabla^2");
export const einsteinTensor = LaTeX("G_{\\mu\\nu}");
export const metricTensor = LaTeX("g_{\\mu\\nu}");
export const ricciTensor = LaTeX("R_{\\mu\\nu}");
export const scalarCurvature = LaTeX("R");
export const energyImpulsTensor = LaTeX("T_{\\mu\\nu}");