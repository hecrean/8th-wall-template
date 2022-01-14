import { match, __, not, select, when, instanceOf } from "ts-pattern";
import {
  Bone,
  Group,
  InstancedMesh,
  Line,
  LineLoop,
  LineSegments,
  LOD,
  Mesh,
  Points,
  Skeleton,
  SkinnedMesh,
  Sprite,
} from "three";
import { CustomEventName } from "vite/types/customEvent";

type Object3dADT =
  | Bone
  | Group
  | InstancedMesh
  | Line
  | LineLoop
  | LineSegments
  | LOD
  | Mesh
  | Points
  | Skeleton
  | SkinnedMesh
  | Sprite;

// export const threeObject = (object3d: Object3dADT): string =>
//   match(object3d)
//     .with(instanceOf(Bone), (bone) => {
//       return `${bone} is an instaceof of a bone`;
//     })
//     .with(instanceOf(Group), (group) => {
//       return `${group} is an instaceof of a group`;
//     })
//     .with(instanceOf(InstancedMesh), (instancedMesh) => {
//       return `${instancedMesh} is an instaceof of a instancedMesh`;
//     })
//     .with(instanceOf(Line), (line) => {
//       return `${line} is an instaceof of a line`;
//     })
//     .with(instanceOf(LineLoop), (lineLoop) => {
//       return `${lineLoop} is an instaceof of a lineLoop`;
//     })
//     .with(instanceOf(LineSegments), (lineSegments) => {
//       return `${lineSegments} is an instaceof of a lineSegments`;
//     })
//     .with(instanceOf(LOD), (lod) => {
//       return `${lod} is an instaceof of a lod`;
//     })
//     .with(instanceOf(Mesh), (mesh) => {
//       return `${mesh} is an instaceof of a mesh`;
//     })
//     .with(instanceOf(Points), (points) => {
//       return `${points} is an instaceof of a points`;
//     })
//     .with(instanceOf(Skeleton), (skeleton) => {
//       return `${skeleton} is an instaceof of a skeleton`;
//     })
//     .with(instanceOf(SkinnedMesh), (skinnedMesh) => {
//       return `${skinnedMesh} is an instaceof of a skinnedMesh`;
//     })
//     .with(instanceOf(Sprite), (sprite) => {
//       return `${sprite} is an instaceof of a sprite`;
//     })
//     .otherwise(() => `no pattern matched`);

/**
 * Html elements in the DOM inherit EventTarget, which gives them three methods:
 * .addEventListener
 * .removeEventListener
 * .dispatchEvent
 *
 */

type HTMLElementEvent<K extends keyof HTMLElementEventMap> = {
  kind: K;
  ev: HTMLElementEventMap[K];
};

// const interpretMsg = <K extends keyof HTMLElementEventMap>(
//   event: HTMLElementEvent<K>
// ) =>
//   match(event)
//     .with({ kind: "pointerover", ev: instanceOf(PointerEvent) }, (kind, ev) => {
//       return `${kind}`;
//     })
//     .run();

//HTMLElementEventMap

// export const domEvent = (event: Event) =>
// match([evnet.]).with()

// type EventName = 'onclick'
// const createEventEmitter = (eventEmmiter: EventTarget ) => {
//     eventEmmiter.addEventListener('all', (event) => {
//         match<[Event, EventTarget ]>([event.name, event.target])
//     })
// }

type Action = {
  target: string;
  event: "mousedown" | "mouseup" | "mousemove" | "touchmove";
  timestamp: number;
};

const uiAction: Action = {
  target: "button-1",
  event: "mousedown",
  timestamp: 1,
};

const result = match<Action>(uiAction)
  .with(
    { target: "button-2", event: "mousedown", timestamp: __ },
    ({ timestamp }) => timestamp
  )
  .with(
    { target: "button-1", event: "mousedown", timestamp: __ },
    ({ timestamp }) => timestamp
  )
  .with(
    { target: "button-1", event: "mouseup", timestamp: __ },
    ({ timestamp }) => timestamp
  )
  .with(
    { target: "button-1", event: "mousedown", timestamp: __ },
    ({ timestamp }) => timestamp
  )
  .run();
