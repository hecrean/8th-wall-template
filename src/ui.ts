import * as THREE from "three";

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
