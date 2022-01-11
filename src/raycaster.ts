import * as THREE from "three";
import { Vector2 } from "three";
import {
  IntersectionEvent,
  DomEvent,
  MouseEv,
  PointerEv,
  TouchEv,
  WheelEv,
} from "./event";

export const initRaycaster = () => {
  const raycaster = new THREE.Raycaster();

  return raycaster;
};

/**
 *
 */
interface RaycasterApi {
  setRayOrientation: (
    raycaster: THREE.Raycaster
  ) => (
    screenRaySource: THREE.Vector2,
    camera: THREE.PerspectiveCamera
  ) => void;
  castRayInResponseToDomEvent: (
    domEvent: DomEvent
  ) => (
    raycaster: THREE.Raycaster,
    camera: THREE.PerspectiveCamera
  ) => (scene: THREE.Scene) => IntersectionEvent<DomEvent>[];
}

export const api: RaycasterApi = {
  setRayOrientation: (raycaster) => (screenRaySource, camera) => {
    raycaster.setFromCamera(screenRaySource, camera);
  },

  castRayInResponseToDomEvent: (domEvent) => (raycaster, camera) => (scene) => {
    switch (domEvent.kind) {
      case "mouse": {
        // calculate the tap position in normalised device coordinates :
        const clickPosition = new Vector2(
          domEvent.ev.offsetX,
          domEvent.ev.offsetY
        );

        raycaster.setFromCamera(clickPosition, camera);

        const intersections = raycaster.intersectObjects(scene.children);
        const mouseEvts: Array<IntersectionEvent<MouseEv>> = intersections.map(
          (intersection) => ({
            ...intersection,
            nativeEvent: domEvent,
          })
        );
        return mouseEvts;
      }
      case "pointer": {
        const pointerPosition = new Vector2(
          domEvent.ev.offsetX,
          domEvent.ev.offsetY
        );

        raycaster.setFromCamera(pointerPosition, camera);

        const intersections = raycaster.intersectObjects(scene.children);
        const pointerEvts: Array<IntersectionEvent<PointerEv>> =
          intersections.map((intersection) => ({
            ...intersection,
            nativeEvent: domEvent,
          }));
        return pointerEvts;
      }
      case "touch": {
        let touchEvts: IntersectionEvent<TouchEv>[] = [];
        for (let i = 0; i < domEvent.ev.touches.length; i++) {
          const ev = createTouchEv(domEvent, raycaster, camera, scene, i);
          touchEvts = touchEvts.concat(ev);
        }
        return touchEvts;
      }
      case "wheel":
        return [];
    }
  },
};

const createTouchEv = (
  event: TouchEv,
  raycaster: THREE.Raycaster,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  touchNumber: number
) => {
  const touchPositionInNDC = new Vector2(
    (event.ev.touches[touchNumber].clientX / window.innerWidth) * 2 - 1,
    (event.ev.touches[touchNumber].clientY / window.innerHeight) * 2 - 1
  );

  raycaster.setFromCamera(touchPositionInNDC, camera);

  const intersections = raycaster.intersectObjects(scene.children);
  const touchEvts: Array<IntersectionEvent<TouchEv>> = intersections.map(
    (intersection) => ({
      ...intersection,
      nativeEvent: event,
    })
  );
  return touchEvts;
};
