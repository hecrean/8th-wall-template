import { SVGAsset, Assets, assetsApi as api } from "./assets";

export const loadSvg = (assets: Assets, src: string) => {
  const loadedSVG = api.load(assets)("svg", src) as Array<SVGAsset>;

  loadedSVG.map(({}) => {});
};
