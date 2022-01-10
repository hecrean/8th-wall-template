import * as THREE from "three";

export const initMouse = (gl: THREE.WebGLRenderer) => {
  const mouse = new THREE.Vector2(0, 0);

  // fromEvent<MouseEvent>(gl.domElement, "pointermove").subscribe((e) => {
  //   const NDC = {
  //     x: (e.clientX / window.innerWidth) * 2 - 1,
  //     y: -(e.clientY / window.innerHeight) * 2 + 1,
  //   };
  //   mouse.set(NDC.x, NDC.y);
  // });

  return mouse;
};
