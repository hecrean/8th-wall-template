import * as THREE from "three";

export type Input = {
  tapPosition: THREE.Vector2;
};

export const input = () => {
  return {
    tapPosition: new THREE.Vector2(),
  };
};
