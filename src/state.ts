import * as THREE from "three";
import { OrbitControlsExp } from "three-stdlib";
import { initSurfaces, SurfaceHandles } from "./surface";
import { initObjects, ObjectHandles } from "./objects";
import { UI, ui } from "./ui";
import { Assets, assets } from "./assets";
import {
  interactionCache,
  InteractionCache,
  interactionCacheApi,
} from "./interaction-cache";
import { buttonEventApi } from "./ui/button";

export type RenderCxt = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  gl: THREE.Renderer;
};

export const initRenderCxt = (): RenderCxt => {
  const canvasEl = document.querySelector("canvas")!;
  const gl = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
  });
  gl.setPixelRatio(window.devicePixelRatio);

  const camera = new THREE.PerspectiveCamera();
  camera.position.z = -10;

  return {
    scene: new THREE.Scene(),
    camera: camera,
    gl,
  };
};

export type SceneGraphCtx = {
  surfaceHandles: SurfaceHandles;
  objectHandles: ObjectHandles;
  raycaster: THREE.Raycaster;
  ui: UI;
  assets: Assets;
  interactionCache: InteractionCache;
  mouse: THREE.Vector2;
};

export const initSceneGraphCtx = (): SceneGraphCtx => {
  const obj3ds = initObjects();

  const cache = interactionCache();

  Object.values(obj3ds).map((o) =>
    interactionCacheApi.register(cache)(o, buttonEventApi)
  );

  return {
    surfaceHandles: initSurfaces(),
    objectHandles: obj3ds,
    ui: ui(),
    raycaster: new THREE.Raycaster(),
    assets: assets(),
    interactionCache: cache,
    mouse: new THREE.Vector2(),
  };
};

export type UserCtx = {
  controls: OrbitControlsExp;
};

export const initUserCtx = (
  camera: THREE.PerspectiveCamera,
  canvasEl: HTMLCanvasElement
): UserCtx => {
  return {
    controls: new OrbitControlsExp(camera, canvasEl),
  };
};

export type State = [RenderCxt, SceneGraphCtx, UserCtx];

export const synchroniseState = (
  renderCtx: RenderCxt,
  sceneGraphCtx: SceneGraphCtx
): State => {
  const obj3ds = Object.values(sceneGraphCtx.objectHandles);
  renderCtx.scene.add(...obj3ds);

  return [
    renderCtx,
    sceneGraphCtx,
    initUserCtx(renderCtx.camera, renderCtx.gl.domElement),
  ];
};
