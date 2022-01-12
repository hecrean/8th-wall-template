import * as THREE from "three";
import { Vector2 } from "three";
import {
  IntersectionEvent,
  DomEvent,
  TouchEventADT,
  PointerEventADT,
} from "./event";
import { SceneGraphCtx, RenderCxt } from "./state";

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
  threeEvent: (
    domEvent: DomEvent
  ) => ({
    raycaster,
  }: SceneGraphCtx) => ({
    scene,
    camera,
  }: RenderCxt) => IntersectionEvent<DomEvent>[];
}

export const api: RaycasterApi = {
  setRayOrientation: (raycaster) => (screenRaySource, camera) => {
    raycaster.setFromCamera(screenRaySource, camera);
  },

  threeEvent:
    (domEvent) =>
    ({ raycaster }) =>
    ({ scene, camera }) => {
      switch (domEvent.kind) {
        // case "mouse": {
        //   // calculate the tap position in normalised device coordinates :
        //   const clickPosition = new Vector2(
        //     domEvent.ev.offsetX,
        //     domEvent.ev.offsetY
        //   );

        //   raycaster.setFromCamera(clickPosition, camera);

        //   const intersections = raycaster.intersectObjects(scene.children);
        //   const mouseEvts: Array<IntersectionEvent<MouseEv>> = intersections.map(
        //     (intersection) => ({
        //       ...intersection,
        //       nativeEvent: domEvent,
        //     })
        //   );
        //   return mouseEvts;
        // }
        case "pointercancel":
        case "pointerdown":
        case "pointerenter":
        case "pointerleave":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "pointerrawupdate":
        case "pointerup": {
          const ev = domEvent.ev as PointerEvent;
          const pointerPosition = new Vector2(ev.offsetX, ev.offsetY);

          raycaster.setFromCamera(pointerPosition, camera);

          const intersections = raycaster.intersectObjects(scene.children);
          const pointerEvts = intersections.map((intersection) => ({
            ...intersection,
            nativeEvent: domEvent,
          }));
          return pointerEvts;
        }
        case "touchcancel":
        case "touchend":
        case "touchmove": {
          let touchEvts: IntersectionEvent<TouchEventADT>[] = [];
          for (let i = 0; i < domEvent.ev.touches.length; i++) {
            const ev = createTouchEv(domEvent, raycaster, camera, scene, i);
            touchEvts = touchEvts.concat(ev);
          }
          return touchEvts;
        }
        // case "wheel":
        //   return [];
      }
    },
};

const createTouchEv = (
  event: TouchEventADT,
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
  const touchEvts: Array<IntersectionEvent<TouchEventADT>> = intersections.map(
    (intersection) => ({
      ...intersection,
      nativeEvent: event,
    })
  );
  return touchEvts;
};
