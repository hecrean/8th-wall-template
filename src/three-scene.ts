import { State } from "./state";
import { api as raycasterApi } from "./raycaster";

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

const updateControls = ([_, { controls }]: State) => {};

const log = ([{ scene }, _]: State) => {
  console.log(scene.children);
};

const render = ([{ scene, gl, camera }, _]: State): void => {
  gl.render(scene, camera);
};

// --> Update

export const update = (state: State) => {
  resizeCanvas(state);
  // log(state);
  render(state);
  requestAnimationFrame(() => update(state));
};
