import { XR8, XRExtras, CameraPipelineEventMsg } from "./type";
import { surfaceHandlers, SurfaceHandles } from "./surface";
import * as THREE from "three";

export type TargetName = "por_amor_al_arte" | "escher_bird";

type Detail = {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: number;
};

const log = (name: string, detail: Detail) => {
  console.log(`handling event ${name}: details: ${JSON.stringify(detail)}`);
};

export const onImageFoundListener = (
  surfaces: SurfaceHandles
): CameraPipelineEventMsg => {
  return {
    event: "reality.imagefound",
    process: ({ name, detail }) => {
      log(name, detail);
      switch (detail.name) {
        case "escher_bird": {
          const { x: x1, y: x2, z: x3 } = detail.position;
          const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
          const p = new THREE.Vector3(x1, x2, x3);
          const q = new THREE.Quaternion(q1, q2, q3, q4);
          const s = new THREE.Vector3(detail.scale, detail.scale, detail.scale);
          surfaceHandlers.align(surfaces[detail.name])(p, q, s);
          surfaceHandlers.makeVisible(surfaces[detail.name]);
          surfaceHandlers.play(surfaces[detail.name]);
          break;
        }
        case "por_amor_al_arte":
          const { x: x1, y: x2, z: x3 } = detail.position;
          const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
          const p = new THREE.Vector3(x1, x2, x3);
          const q = new THREE.Quaternion(q1, q2, q3, q4);
          const s = new THREE.Vector3(detail.scale, detail.scale, detail.scale);
          surfaceHandlers.align(surfaces[detail.name])(p, q, s);
          surfaceHandlers.makeVisible(surfaces[detail.name]);
          surfaceHandlers.play(surfaces[detail.name]);
          break;
        default:
          break;
      }
    },
  };
};
export const onImageLostListener = (
  surfaces: SurfaceHandles
): CameraPipelineEventMsg => {
  return {
    event: "reality.imagelost",
    process: ({ name, detail }) => {
      log(name, detail);

      switch (detail.name) {
        case "escher_bird":
          surfaceHandlers.pause(surfaces[detail.name]);
          surfaceHandlers.makeInvisible(surfaces[detail.name]);
          break;
        case "por_amor_al_arte":
          surfaceHandlers.pause(surfaces[detail.name]);
          surfaceHandlers.makeInvisible(surfaces[detail.name]);
          break;
        default:
          break;
      }
    },
  };
};

export const onImageUpdatedListener = (
  surfaces: SurfaceHandles
): CameraPipelineEventMsg => {
  return {
    event: "reality.imageupdated",
    process: ({ name, detail }) => {
      log(name, detail);

      switch (detail.name) {
        case "escher_bird": {
          const { x: x1, y: x2, z: x3 } = detail.position;
          const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
          const p = new THREE.Vector3(x1, x2, x3);
          const q = new THREE.Quaternion(q1, q2, q3, q4);
          const s = new THREE.Vector3(detail.scale, detail.scale, detail.scale);
          surfaceHandlers.align(surfaces[detail.name])(p, q, s);
          surfaceHandlers.makeVisible(surfaces[detail.name]);
          surfaceHandlers.play(surfaces[detail.name]);
          break;
        }
        case "por_amor_al_arte":
          const { x: x1, y: x2, z: x3 } = detail.position;
          const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
          const p = new THREE.Vector3(x1, x2, x3);
          const q = new THREE.Quaternion(q1, q2, q3, q4);
          const s = new THREE.Vector3(detail.scale, detail.scale, detail.scale);
          surfaceHandlers.align(surfaces[detail.name])(p, q, s);
          surfaceHandlers.makeVisible(surfaces[detail.name]);
          surfaceHandlers.play(surfaces[detail.name]);
          break;
        default:
          break;
      }
    },
  };
};
