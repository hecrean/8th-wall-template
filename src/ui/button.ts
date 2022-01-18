import { EventHandlers } from "../event";
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial } from "three";

const isMesh = (
  o: Object3D
): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
  return o instanceof Mesh;
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

const unitFn = (): void => {};

export const buttonEventApi: EventHandlers = {
  ...defaultEventHandlers,
  onTouchStart: ([renderCtx, sceneGraphCtx, userCtx], intersectionEv) => {
    //Prevent the browser from processing emulated mouse events.
    intersectionEv.nativeEvent.event.preventDefault();

    return [renderCtx, sceneGraphCtx, userCtx];
  },
  onPointerDown: (state, intersectionEv) => {
    isMesh(intersectionEv.object)
      ? intersectionEv.object.material.color.set("yellow")
      : unitFn;

    return state;
  },
  onPointerUp: (state, intersectionEv) => {
    isMesh(intersectionEv.object)
      ? intersectionEv.object.material.color.set("blue")
      : unitFn;

    return state;
  },
  // onPointerMove: (state, intersectionEv) => {
  //   isMesh(intersectionEv.object)
  //     ? intersectionEv.object.material.color.set("pink")
  //     : _;

  //   return state;
  // },
};

const canvasEventApi: EventHandlers = {
  ...defaultEventHandlers,
};
