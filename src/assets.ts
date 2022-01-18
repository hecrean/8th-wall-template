import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { SVGLoader, SVGResult, SVGResultPaths } from 'three/examples/jsm/loaders/SVGLoader';

import { Shape } from 'three';

export interface Assets {
    log: Array<string>;
    loaders: {
        gltf: GLTFLoader;
        texture: THREE.TextureLoader;
        svg: SVGLoader;
    };
    // loadQueue: Array<any>;
    cache: { [key: string]: unknown };
}

export const assets = () => {
    return {
        log: [],
        loaders: {
            gltf: new GLTFLoader(),
            texture: new THREE.TextureLoader(),
            svg: new SVGLoader(),
        },
        // loadQueue: [],
        cache: {},
    };
};

type AssetKind = 'gltf' | 'texture' | 'svg';
/*| "image" | "audio" | "video" | "json" |*/

interface AssetApi {
    load: (assets: Assets) => (kind: AssetKind, url: string) => unknown;
    log: () => void;
    loadQueue: (assets: Assets) => (queue: Array<{ kind: AssetKind; url: string }>) => void;
}

export const assetsApi: AssetApi = {
    load: (assets) => (kind, url) => {
        if (assets.cache[url]) {
            const asset = assets.cache[url];
            return asset;
        }
        switch (kind) {
            case 'gltf': {
                const onLoad = (gltf: GLTF) => {
                    assets.cache.url = gltf;
                };
                const onProgress = () => ({});
                const onError = () => ({});
                assets.loaders.gltf.load(url, onLoad, onProgress, onError);
                return assets.cache.url;
            }
            case 'texture': {
                const onLoad = (texture: THREE.Texture) => {
                    assets.cache.url = texture;
                };
                const onProgress = () => ({});
                const onError = () => ({});
                const texture = assets.loaders.texture.load(url, onLoad, onProgress, onError);
                return texture;
            }
            case 'svg': {
                const onLoad = (svgResult: SVGResult) => {
                    const loadedSVG: Array<SVGAsset> = svgResult.paths.flatMap((g: SVGResultPaths, index: number) =>
                        g.toShapes(true).map((shape: Shape) => ({ shape, color: g.color, index })),
                    );

                    assets.cache.url = loadedSVG;
                };
                const onProgress = () => ({});
                const onError = () => ({});
                const svgAsset = assets.loaders.svg.load(url, onLoad, onProgress, onError);
                return svgAsset;
            }
        }
    },
    loadQueue: (assets) => (queue) => {
        queue.map(({ kind, url }) => assetsApi.load(assets)(kind, url));
    },
    log: () => ({}),
};

//utility types;
export type SVGAsset = {
    shape: THREE.Shape;
    color: THREE.Color;
    index: number;
};
