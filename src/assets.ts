import { string } from "fp-ts";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three-stdlib";

export interface Assets {
  log: Array<string>;
  loaders: {
    gltf: GLTFLoader;
    texture: THREE.TextureLoader;
  };
  loadQueue: Array<any>;
  cache: { [key: string]: any };
}

export const assets = () => {
  return {
    log: [],
    loaders: {
      gltf: new GLTFLoader(),
      texture: new THREE.TextureLoader(),
    },
    loadQueue: [],
    cache: {},
  };
};

type AssetKind =
  | "gltf"
  | "texture"; /*| "image" | "audio" | "video" | "json" |*/

interface AssetApi {
  load: (assets: Assets) => (kind: AssetKind, url: string) => void;
  log: () => void;
  loadQueue: (
    assets: Assets
  ) => (queue: Array<{ kind: AssetKind; url: string }>) => void;
}

export const api: AssetApi = {
  load: (assets) => (kind, url) => {
    switch (kind) {
      case "gltf": {
        const onLoad = (gltf: GLTF) => {
          assets.cache.url = gltf;
        };
        const onProgress = () => {};
        const onError = (ev: ErrorEvent) => {};
        assets.loaders.gltf.load(url, onLoad, onProgress, onError);
        break;
      }
      case "texture": {
        const onLoad = (texture: THREE.Texture) => {
          assets.cache.url = texture;
        };
        const onProgress = () => {};
        const onError = (ev: ErrorEvent) => {};
        assets.loaders.texture.load(url, onLoad, onProgress, onError);
        break;
      }
    }
  },
  loadQueue: (assets) => (queue) => {
    queue.map(({ kind, url }) => api.load(assets)(kind, url));
  },
  log: () => {},
};
