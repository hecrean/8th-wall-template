import {
  AmbientLight,
  BoxBufferGeometry,
  BoxGeometry,
  Clock,
  Intersection,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import * as THREE from "three";

import { OrbitControlsExp } from "three-stdlib";
import { fromEvent, Observable } from "rxjs";
import * as Rx from "rxjs";

import type { EventHandlers } from "./event";
import * as O from "fp-ts/Option";
// --> State :

type State = {
  gl: WebGLRenderer;
  canvasEl: HTMLCanvasElement;
  scene: Scene;
  camera: PerspectiveCamera;
  clock: Clock;
  controls: OrbitControlsExp;
  raycaster: Raycaster;
  mouse: Vector2;
  intersection: O.Option<Intersection>;
};

const initMouse = (gl: WebGLRenderer) => {
  const mouse = new Vector2(0, 0);
  fromEvent<MouseEvent>(gl.domElement, "pointermove").subscribe((e) => {
    const NDC = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
    mouse.set(NDC.x, NDC.y);
  });

  return mouse;
};

const initLights = () => {
  const ambientLigt = new THREE.AmbientLight();
  return [ambientLigt];
};

const initBox = ({ gl, intersection }: State) => {
  const box = new Mesh(new BoxBufferGeometry(), new MeshStandardMaterial());

  const source: Observable<MouseEvent> = fromEvent<MouseEvent>(
    gl.domElement,
    "pointerdown"
  );

  source.subscribe((e) => {
    console.log("clicked");
    switch (intersection._tag) {
      case "None":
        break;
      case "Some":
        if (intersection.value.object.uuid === box.uuid) {
          box.material.color.set("red");
          console.log("hit");
        }
        break;
    }
  });

  return box;
};

const initVideoSurface = (
  videoUrl: string
): [HTMLVideoElement, Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>] => {
  const videoEl = document.createElement("video");
  videoEl.src = videoUrl;
  videoEl.setAttribute("preload", "auto");
  videoEl.setAttribute("loop", "");
  videoEl.setAttribute("muted", "");
  videoEl.setAttribute("playsinline", "");
  videoEl.setAttribute("webkit-playsinline", "");

  const texture = new THREE.VideoTexture(videoEl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  const videoSurfaceMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.75, 1),
    new THREE.MeshBasicMaterial({ map: texture })
  );

  return [videoEl, videoSurfaceMesh];
};

const init = (): State => {
  const canvasEl = document.querySelector("canvas")!;
  const gl = new WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
  });
  gl.setPixelRatio(window.devicePixelRatio);

  const clock = new Clock();
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  camera.position.z = 10;

  const controls = new OrbitControlsExp(camera, canvasEl);

  const raycaster = new Raycaster();

  const mouse = initMouse(gl);

  const lights = initLights();
  lights.forEach((light) => scene.add(light));

  return {
    gl,
    canvasEl,
    scene,
    camera,
    clock,
    controls,
    raycaster,
    mouse,
    intersection: O.none,
  };
};

const state: State = init();

// scene
const $box1 = initBox(state);
state.scene.add($box1);

// --> Events
const keysDownObservable$ = Rx.fromEvent<KeyboardEvent>(document, "keydown");
keysDownObservable$.pipe(Rx.map((event: KeyboardEvent) => {}));

// --> Update

const update = ({
  gl,
  camera,
  clock,
  scene,
  raycaster,
  mouse,
  intersection,
}: State) => {
  const canvasEl = gl.domElement;
  const width = canvasEl.clientWidth;
  const height = canvasEl.clientHeight;
  const needResize = canvasEl.width !== width || canvasEl.height !== height;
  if (needResize) {
    gl.setSize(width, height, false);
    camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    camera.updateProjectionMatrix();
  }

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  switch (intersects.length > 0) {
    case false:
      intersection = O.none;
      break;
    case true:
      intersection = O.some(intersects[0]);
      break;
  }

  gl.render(scene, camera);
  requestAnimationFrame(() => update(state));
};

update(state);
