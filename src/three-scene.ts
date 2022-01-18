import { State } from "./state";
import { api as raycasterApi } from "./raycaster";
import { Input } from "./user";
import { interpreter } from "./event";
import { state } from "fp-ts";

const resizeCanvas = ([{ gl, camera }, _]: State): void => {
  const canvasEl = gl.domElement;
  const width = canvasEl.clientWidth;
  const height = canvasEl.clientHeight;
  const needResize = canvasEl.width !== width || canvasEl.height !== height;
  if (needResize) {
    gl.setSize(width, height, false);
    camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    camera.updateProjectionMatrix();
  }
};

const log = ([{ scene }, _]: State) => {
  console.log(scene.children);
};

const render = ([{ scene, gl, camera }, _]: State): void => {
  gl.render(scene, camera);
};

export const responseToInput = (
  input: Input,
  [renderCxt, sceneGraphCxt, userCtx]: State
) => {
  const { threeEvent } = raycasterApi;
  const intersectionEvts = threeEvent(input.canvasEvent)(sceneGraphCxt)(
    renderCxt
  );
  return interpreter([renderCxt, sceneGraphCxt, userCtx], intersectionEvts[0]);
};

// --> Update

export const update = (state: State) => {
  resizeCanvas(state);
  // log(state);
  render(state);
  requestAnimationFrame(() => update(state));
};
