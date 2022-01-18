import { EventHandlers } from "../event";
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial } from "three";

const isMesh = (
  o: Object3D
): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
  return o instanceof Mesh;
};

export const defaultEventHandlers: EventHandlers = {
  onPointerEnter: (state, _) => state,
  onPointerUp: (state, _) => state,
  onPointerDown: (state, _) => state,
  onPointerOver: (state, _) => state,
  onPointerOut: (state, _) => state,
  onPointerLeave: (state, _) => state,
  onPointerMove: (state, _) => state,
  onPointerCancel: (state, _) => state,
  onTouchStart: (state, _) => state,
  onTouchMove: (state, _) => state,
  onTouchEnd: (state, _) => state,
  onTouchCancel: (state, _) => state,
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
