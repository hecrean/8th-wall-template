import * as THREE from "three";
import { initSurfaces, SurfaceHandles } from "./surface";
import { initObjects, ObjectHandles } from "./objects";
import { UI, ui } from "./ui";
import { Input } from "./input";
import { Assets, assets } from "./assets";
import { interactionCache, InteractionCache } from "./interaction-cache";
import { BehaviorSubject, withLatestFrom, map, tap } from "rxjs";
import { frames$ } from "./frame";
import { input$ } from "./observables";
import { theeEventInterpreter } from "./event";
import { api as raycasterApi } from "./raycaster";
import { BoxBufferGeometry, Mesh, MeshNormalMaterial } from "three";
import { OrbitControlsExp } from "three-stdlib";

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
  controls: OrbitControlsExp;
  mouse: THREE.Vector2;
};

export const initSceneGraphCtx = ({ camera, gl }: RenderCxt): SceneGraphCtx => {
  return {
    surfaceHandles: initSurfaces(),
    objectHandles: initObjects(),
    ui: ui(),
    raycaster: new THREE.Raycaster(),
    assets: assets(),
    interactionCache: interactionCache(),
    controls: new OrbitControlsExp(camera, gl.domElement),
    mouse: new THREE.Vector2(),
  };
};

export type State = [RenderCxt, SceneGraphCtx];

const renderCtx = initRenderCxt();
const sceneGraphCtx = initSceneGraphCtx(renderCtx);
const obj3ds = Object.values(sceneGraphCtx.objectHandles);
renderCtx.scene.add(...obj3ds);
export const initState: State = [renderCtx, sceneGraphCtx];

/////

// Since we will be updating our gamestate each frame we can use an Observable
//  to track that as a series of states with the latest emission being the current
//  state of our game.
const state$: BehaviorSubject<[RenderCxt, SceneGraphCtx]> = new BehaviorSubject(
  initState
);

const update = (
  dt: number,
  [renderCxt, sceneGraphCtx]: [RenderCxt, SceneGraphCtx],
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

  return theeEventInterpreter(intersectionEvts[0], [renderCxt, sceneGraphCtx]);
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
