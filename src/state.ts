import * as THREE from "three";
import { initSurfaces, SurfaceHandles } from "./surface";
import { initObjects, ObjectHandles } from "./objects";
import { UI, ui } from "./ui";
import { Input } from "./input";
import { Assets, assets } from "./assets";
import {
  interactionCache,
  InteractionCache,
  interactionCacheApi,
} from "./interaction-cache";
import { BehaviorSubject, withLatestFrom, map, tap } from "rxjs";
import { frames$ } from "./frame";
import { input$ } from "./observables";
import { theeEventInterpreter } from "./event";
import { api as raycasterApi } from "./raycaster";
import { BoxBufferGeometry, Mesh, MeshNormalMaterial } from "three";
import { OrbitControlsExp } from "three-stdlib";
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

/////

// Since we will be updating our gamestate each frame we can use an Observable
//  to track that as a series of states with the latest emission being the current
//  state of our game.
const state$: BehaviorSubject<State> = new BehaviorSubject(
  synchroniseState(initRenderCxt(), initSceneGraphCtx())
);

const update = (
  dt: number,
  [renderCxt, sceneGraphCtx, userCxt]: State,
  input: Input
): [RenderCxt, SceneGraphCtx] => {
  const canvasEl = renderCxt.gl.domElement;
  const width = canvasEl.clientWidth;
  const height = canvasEl.clientHeight;
  const needResize = canvasEl.width !== width || canvasEl.height !== height;
  if (needResize) {
    renderCxt.gl.setSize(width, height, false);
    renderCxt.camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    renderCxt.camera.updateProjectionMatrix();
  }

  const { threeEvent } = raycasterApi;
  const intersectionEvts = threeEvent(input.domEvent)(sceneGraphCtx)(renderCxt);

  theeEventInterpreter(intersectionEvts[0], [
    renderCxt,
    sceneGraphCtx,
    userCxt,
  ]);
  return [renderCxt, sceneGraphCtx];
};

const render = ([{ scene, gl, camera }, _]: State): void => {
  gl.render(scene, camera);
};

//  We subscribe to our frames$ stream to kick it off, and make sure to
//  combine in the latest emission from our inputs stream to get the data
//  we need do perform our gameState updates.
export const run = () =>
  frames$
    .pipe(
      withLatestFrom(state$, input$),
      map(([dt, state, input]) => update(dt, state, input)),
      tap((state) => state$.next(state))
    )
    .subscribe((state) => render(state));
