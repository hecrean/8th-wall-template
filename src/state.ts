import * as THREE from "three";
import { initSurfaces, SurfaceHandles } from "./surface";
import { initObjects, ObjectHandles } from "./objects";
import { UI, ui } from "./ui";
import { Input, input } from "./input";
import { Assets, assets } from "./assets";
import { interactionCache, InteractionCache } from "./interaction-cache";
import { BehaviorSubject, withLatestFrom, map, tap } from "rxjs";
import { frames$ } from "./frame";
import { input$ } from "./observables";
import { theeEventInterpreter } from "./event";
import { api as raycasterApi } from "./raycaster";

export type RenderCxt = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
};

export const initRenderCxt = (): RenderCxt => {
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: new THREE.WebGLRenderer(),
  };
};

export type SceneGraphCtx = {
  surfaceHandles: SurfaceHandles;
  objectHandles: ObjectHandles;
  raycaster: THREE.Raycaster;
  ui: UI;
  assets: Assets;
  interactionCache: InteractionCache;
};

export const initSceneGraphCtx = (): SceneGraphCtx => {
  return {
    surfaceHandles: initSurfaces(),
    objectHandles: initObjects(),
    ui: ui(),
    raycaster: new THREE.Raycaster(),
    assets: assets(),
    interactionCache: interactionCache(),
  };
};

export type State = [RenderCxt, SceneGraphCtx];

// Since we will be updating our gamestate each frame we can use an Observable
//  to track that as a series of states with the latest emission being the current
//  state of our game.
const gamestate$: BehaviorSubject<[RenderCxt, SceneGraphCtx]> =
  new BehaviorSubject([initRenderCxt(), initSceneGraphCtx()]);

//  We subscribe to our frames$ stream to kick it off, and make sure to
//  combine in the latest emission from our inputs stream to get the data
//  we need do perform our gameState updates.
frames$
  .pipe(
    withLatestFrom(gamestate$, input$),
    map(([dt, state, input]) => update(dt, state, input)),
    tap((state) => gamestate$.next(state))
  )
  .subscribe((state) => render(state));

const update = (
  dt: number,
  [renderCxt, sceneGraphCtx]: [RenderCxt, SceneGraphCtx],
  input: Input
): [RenderCxt, SceneGraphCtx] => {
  const { threeEvent } = raycasterApi;
  const intersectionEvts = threeEvent(input.domEvent)(sceneGraphCtx)(renderCxt);

  return theeEventInterpreter(intersectionEvts[0], [renderCxt, sceneGraphCtx]);
};

declare const render: (state: [RenderCxt, SceneGraphCtx]) => void;
