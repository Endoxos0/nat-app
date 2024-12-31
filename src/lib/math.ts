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
export const properTime = LaTeX("\\tau");
export const vectorNormIsC = LaTeX("\\left\\lVert \\overrightarrow{v}\\right\\rVert = c");
export const vectorDecomposed = LaTeX("\\overrightarrow{v} = v^0\\overrightarrow{e_0} + v^1\\overrightarrow{e_1}", { displayMode: true });
export const einsteinNotationExample = LaTeX("\\overrightarrow{v} = v^0\\overrightarrow{e_0} + v^1\\overrightarrow{e_1} = v^{\\alpha}\\overrightarrow{e_{\\alpha}}", { displayMode: true });
export const dvdtauIsZero = LaTeX("\\dfrac{\\mathrm{d}\\overrightarrow{v}}{\\mathrm{d}\\tau} = \\overrightarrow{0}", { displayMode: true });
export const dvdtauFactors1 = LaTeX("\\dfrac{\\mathrm{d}(v^{\\alpha}\\overrightarrow{e_{\\alpha}})}{\\mathrm{d}\\tau} = \\overrightarrow{0}", { displayMode: true });
export const dvdtauFactors2 = LaTeX(
    `v^{\\alpha}\\dfrac{\\mathrm{d}\\overrightarrow{e_{\\alpha}}}{\\mathrm{d}\\tau} 
    + \\dfrac{\\mathrm{d}v^{\\alpha}}{\\mathrm{d}\\tau}\\overrightarrow{e_{\\alpha}}
    = \\overrightarrow{0}`,
    { displayMode: true });
export const dedtau = LaTeX
    (`\\dfrac{\\mathrm{d}\\overrightarrow{e_1}}{\\mathrm{d}\\tau} = 
        \\dfrac{\\mathrm{d}\\overrightarrow{e_1}}{\\mathrm{d}x^0}v^0
        + \\dfrac{\\mathrm{d}\\overrightarrow{e_1}}{\\mathrm{d}x^1}v^1`,
        { displayMode: true });
export const Gamma = LaTeX("\\Gamma");
export const geodesicEquation = LaTeX(`\\dfrac{\\mathrm{d}v^{\\alpha}}{\\mathrm{d}\\tau}
    = -\\Gamma^{\\alpha}_{\\mu\\nu}v^{\\mu}v^{\\nu}`, { displayMode: true });