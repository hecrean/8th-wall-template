import THREE, { Intersection, Object3D, Vector2 } from "three";
import { InteractionCache } from "./interaction-cache";
import { State } from "./state";
import { Input } from "./input";
/**
 * Events :
 * - keyboard events
 * - pointer events (by mouse) / touch events (my fingers)
 * - image target found/updated/lost
 *
 *
 * Pointer and touch events have to be updated for 3D scenes. There is no native machinery for dealing
 * with clicks etc. on meshes. Using the three.js raycaster, three.js camera and native dom click/touch events
 * on the 2D canvas surface, we extrapolate which meshes have been interacted with, and in what way. We have to
 * define the nature of these interactions...
 *
 * We then create an interaction 'cache'. This stores information about how unique meshes respond to different
 * events of which they are the target. i.e. we have to register event handlers for every interactive mesh in the
 * scene...
 *
 */

export type PointerEventKinds =
  | "pointerover"
  | "pointerenter"
  | "pointerdown"
  | "pointermove"
  | "pointerrawupdate"
  | "pointerup"
  | "pointercancel"
  | "pointerout"
  | "pointerleave";

export type TouchEventKinds =
  | "touchstart" // fired when a touch point is placed on the touch surface.
  | "touchmove" // fired when a touch point is moved along the touch surface.
  | "touchend" // fired when a touch point is removed from the touch surface.
  | "touchcancel"; // fired when a touch point has been disrupted in an implementation-specific manner (for example, too many touch points are created).

export type EventKinds = PointerEventKinds | TouchEventKinds;

export type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

export interface IntersectionEvent<TSourceEvent> extends THREE.Intersection {
  nativeEvent: TSourceEvent;
}

export function pointeroverEv(ev: PointerEvent) {
  return { kind: "pointerover" as const, ev };
}
export type pointerover = ReturnType<typeof pointeroverEv>;

export function pointerenterEv(ev: PointerEvent) {
  return { kind: "pointerenter" as const, ev };
}
export type pointerenter = ReturnType<typeof pointerenterEv>;

export function pointerdownEv(ev: PointerEvent) {
  return { kind: "pointerdown" as const, ev };
}
export type pointerdown = ReturnType<typeof pointerdownEv>;

export function pointermoveEv(ev: PointerEvent) {
  return { kind: "pointermove" as const, ev };
}
export type pointermove = ReturnType<typeof pointermoveEv>;

export function pointerrawupdateEv(ev: PointerEvent) {
  return { kind: "pointerrawupdate" as const, ev };
}
export type pointerrawupdate = ReturnType<typeof pointerrawupdateEv>;

export function pointerupEv(ev: PointerEvent) {
  return { kind: "pointerup" as const, ev };
}
export type pointerup = ReturnType<typeof pointerupEv>;

export function pointercancelEv(ev: PointerEvent) {
  return { kind: "pointercancel" as const, ev };
}
export type pointercancel = ReturnType<typeof pointercancelEv>;

export function pointeroutEv(ev: PointerEvent) {
  return { kind: "pointerout" as const, ev };
}
export type pointerout = ReturnType<typeof pointeroutEv>;

export function pointerleaveEv(ev: PointerEvent) {
  return { kind: "pointerleave" as const, ev };
}
export type pointerleave = ReturnType<typeof pointerleaveEv>;

export type PointerEventADT =
  | pointerover
  | pointerenter
  | pointerdown
  | pointermove
  | pointerrawupdate
  | pointerup
  | pointercancel
  | pointerout
  | pointerleave;

export function touchstartEv(ev: TouchEvent) {
  return { kind: "pointerleave" as const, ev };
}

export type touchstart = ReturnType<typeof touchstartEv>;

export function touchmoveEv(ev: TouchEvent) {
  return { kind: "touchmove" as const, ev };
}
export type touchmove = ReturnType<typeof touchmoveEv>;

export function touchendEv(ev: TouchEvent) {
  return { kind: "touchend" as const, ev };
}
export type touchend = ReturnType<typeof touchendEv>;

export function touchcancelEv(ev: TouchEvent) {
  return { kind: "touchcancel" as const, ev };
}
export type touchcancel = ReturnType<typeof touchcancelEv>;

export type TouchEventADT = touchstart | touchmove | touchend | touchcancel;

///

export type DomEvent = PointerEventADT | TouchEventADT;

export type EventHandlers = {
  onPointerUp?: (event: IntersectionEvent<pointerup>) => State;
  onPointerDown?: (event: IntersectionEvent<pointerdown>) => State;
  onPointerOver?: (event: IntersectionEvent<pointerover>) => State;
  onPointerOut?: (event: IntersectionEvent<pointerout>) => State;
  onPointerEnter?: (event: IntersectionEvent<pointerenter>) => State;
  onPointerLeave?: (event: IntersectionEvent<pointerleave>) => State;
  onPointerMove?: (event: IntersectionEvent<pointermove>) => State;
  onPointerCancel?: (event: IntersectionEvent<pointercancel>) => State;
  onTouchStart?: (event: IntersectionEvent<touchstart>) => State;
  onTouchMove?: (event: IntersectionEvent<touchmove>) => State;
  onTouchEnd?: (event: IntersectionEvent<touchend>) => State;
  onTouchCancel?: (event: IntersectionEvent<touchcancel>) => State;
};

const action = <DomEvent>(
  ev: IntersectionEvent<DomEvent>,
  state: State,
  handler?: (event: IntersectionEvent<DomEvent>) => State
) => {
  return handler ? handler(ev) : state;
};

export const theeEventInterpreter = (
  ev: IntersectionEvent<DomEvent>,
  state: State
): State => {
  const [_, sceneGraphCtx] = state;

  const handlers = sceneGraphCtx.interactionCache.get(ev.object.uuid);
  if (!handlers) return state;

  switch (ev.nativeEvent.kind) {
    case "pointercancel":
      return action<pointercancel>(
        ev as IntersectionEvent<pointercancel>,
        state,
        handlers.onPointerCancel
      );
    case "pointerdown":
      return action<pointerdown>(
        ev as IntersectionEvent<pointerdown>,
        state,
        handlers.onPointerDown
      );
    case "pointerenter":
      return action<pointerenter>(
        ev as IntersectionEvent<pointerenter>,
        state,
        handlers.onPointerEnter
      );
    case "pointerleave":
      return action<pointerleave>(
        ev as IntersectionEvent<pointerleave>,
        state,
        handlers.onPointerLeave
      );
    case "pointermove":
      return action<pointermove>(
        ev as IntersectionEvent<pointermove>,
        state,
        handlers.onPointerMove
      );
    case "pointerout":
      return action<pointerout>(
        ev as IntersectionEvent<pointerout>,
        state,
        handlers.onPointerOut
      );
    case "pointerover":
      return action<pointerover>(
        ev as IntersectionEvent<pointerover>,
        state,
        handlers.onPointerOver
      );
    case "pointerrawupdate":
      return state;
    case "pointerup":
      return action<pointerup>(
        ev as IntersectionEvent<pointerup>,
        state,
        handlers.onPointerUp
      );
    case "touchcancel":
      return action<touchcancel>(
        ev as IntersectionEvent<touchcancel>,
        state,
        handlers.onTouchCancel
      );
    case "touchend":
      return action<touchend>(
        ev as IntersectionEvent<touchend>,
        state,
        handlers.onTouchEnd
      );
    case "touchmove":
      return action<touchmove>(
        ev as IntersectionEvent<touchmove>,
        state,
        handlers.onTouchMove
      );
  }
};
