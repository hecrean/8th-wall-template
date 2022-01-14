import * as THREE from "three";
import { EventHandlers } from "../event";

export type UI = {
  button1: THREE.Mesh;
};

// class Button {
//   mesh: THREE.Mesh;

//   constructor() {
//     const diffuseMap = new THREE.Texture();
//     const material = new THREE.MeshBasicMaterial({ map: diffuseMap });
//     const plane = new THREE.PlaneGeometry(2, 2);
//     const mesh = new THREE.Mesh(plane, material);
//     this.mesh = mesh;
//   }
// }

export const ui = (): UI => {
  const diffuseMap1 = new THREE.Texture();
  const material1 = new THREE.MeshBasicMaterial({ map: diffuseMap1 });
  const plane1 = new THREE.PlaneGeometry(2, 2);
  const button1 = new THREE.Mesh(plane1, material1);

  return {
    button1,
  };
};

export const defaultEventHandlers: EventHandlers = {
  onPointerEnter: (state, event) => state,
  onPointerUp: (state, event) => state,
  onPointerDown: (state, event) => state,
  onPointerOver: (state, event) => state,
  onPointerOut: (state, event) => state,
  onPointerLeave: (state, event) => state,
  onPointerMove: (state, event) => state,
  onPointerCancel: (state, event) => state,
  onTouchStart: (state, event) => state,
  onTouchMove: (state, event) => state,
  onTouchEnd: (state, event) => state,
  onTouchCancel: (state, event) => state,
};
