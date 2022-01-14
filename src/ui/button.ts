import { EventHandlers } from "../event";
import { defaultEventHandlers } from ".";
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial } from "three";

const isMesh = (
  o: Object3D
): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
  return o instanceof Mesh;
};

const _ = (): void => {};

export const buttonEventApi: EventHandlers = {
  ...defaultEventHandlers,
  onTouchStart: ([renderCtx, sceneGraphCtx, userCtx], intersectionEv) => {
    //Prevent the browser from processing emulated mouse events.
    intersectionEv.nativeEvent.event.preventDefault();

    return [renderCtx, sceneGraphCtx, userCtx];
  },
  // onPointerEnter: (state, intersectionEv) => {
  //   const target = intersectionEv.object;
  //   isMesh(target) ? target.material.color.set("green") : _;
  //   return state;
  // },
  // onPointerLeave: (state, intersectionEv) => {
  //   isMesh(intersectionEv.object)
  //     ? intersectionEv.object.material.color.set("yellow")
  //     : _;

  //   return state;
  // },
  onPointerDown: (state, intersectionEv) => {
    isMesh(intersectionEv.object)
      ? intersectionEv.object.material.color.set("yellow")
      : _;

    return state;
  },
  onPointerUp: (state, intersectionEv) => {
    isMesh(intersectionEv.object)
      ? intersectionEv.object.material.color.set("blue")
      : _;

    return state;
  },
};

const canvasEventApi: EventHandlers = {
  ...defaultEventHandlers,
};
