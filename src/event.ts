import THREE, { Intersection, Object3D, Vector2 } from "three";
import { InteractionCache } from "./interaction-cache";
import { State } from "./state";
import { Input } from "./input";

import { Events, EventADT } from "./types/dom/event";

export type CanvasEvents = Events<"canvas">;
export type CavnasEventADT = EventADT<"canvas">;

export interface IntersectionEvent<TSourceEvent = CavnasEventADT>
  extends THREE.Intersection {
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
  onPointerUp?: (event: IntersectionEvent<pointerup>) => void;
  onPointerDown?: (event: IntersectionEvent<pointerdown>) => void;
  onPointerOver?: (event: IntersectionEvent<pointerover>) => void;
  onPointerOut?: (event: IntersectionEvent<pointerout>) => void;
  onPointerEnter?: (event: IntersectionEvent<pointerenter>) => void;
  onPointerLeave?: (event: IntersectionEvent<pointerleave>) => void;
  onPointerMove?: (event: IntersectionEvent<pointermove>) => void;
  onPointerCancel?: (event: IntersectionEvent<pointercancel>) => void;
  onTouchStart?: (event: IntersectionEvent<touchstart>) => void;
  onTouchMove?: (event: IntersectionEvent<touchmove>) => void;
  onTouchEnd?: (event: IntersectionEvent<touchend>) => void;
  onTouchCancel?: (event: IntersectionEvent<touchcancel>) => void;
};

const action = <DomEvent>(
  ev: IntersectionEvent<DomEvent>,
  handler?: (event: IntersectionEvent<DomEvent>) => void
) => {
  console.log(handler);
  handler ? handler(ev) : () => {};
};

export const theeEventInterpreter = (
  ev: IntersectionEvent<DomEvent>,
  state: State
) => {
  const [_, sceneGraphCtx] = state;

  console.log("event uuid in interpreter", ev.object.uuid);
  console.log("cache in intepreter", sceneGraphCtx.interactionCache);
  const handlers = sceneGraphCtx.interactionCache.get(ev.object.uuid);
  console.log("our handlers", handlers);
  if (!handlers) return;

  switch (ev.nativeEvent.kind) {
    case "pointercancel":
      return action<pointercancel>(
        ev as IntersectionEvent<pointercancel>,
        handlers.onPointerCancel
      );
    case "pointerdown":
      action<pointerdown>(
        ev as IntersectionEvent<pointerdown>,
        handlers.onPointerDown
      );
    case "pointerenter":
      return action<pointerenter>(
        ev as IntersectionEvent<pointerenter>,
        handlers.onPointerEnter
      );
    case "pointerleave":
      return action<pointerleave>(
        ev as IntersectionEvent<pointerleave>,
        handlers.onPointerLeave
      );
    case "pointermove":
      return action<pointermove>(
        ev as IntersectionEvent<pointermove>,
        handlers.onPointerMove
      );
    case "pointerout":
      return action<pointerout>(
        ev as IntersectionEvent<pointerout>,
        handlers.onPointerOut
      );
    case "pointerover":
      return action<pointerover>(
        ev as IntersectionEvent<pointerover>,
        handlers.onPointerOver
      );
    case "pointerrawupdate":
      return state;
    case "pointerup":
      return action<pointerup>(
        ev as IntersectionEvent<pointerup>,
        handlers.onPointerUp
      );
    case "touchcancel":
      return action<touchcancel>(
        ev as IntersectionEvent<touchcancel>,
        handlers.onTouchCancel
      );
    case "touchend":
      return action<touchend>(
        ev as IntersectionEvent<touchend>,
        handlers.onTouchEnd
      );
    case "touchmove":
      return action<touchmove>(
        ev as IntersectionEvent<touchmove>,
        handlers.onTouchMove
      );
  }
};
