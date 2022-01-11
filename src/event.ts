import THREE, { Intersection, Object3D, Vector2 } from "three";

/**
 * keyboard events, chunks of data from websocket, jobs in a worker queue, etc.
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

export function pointerEv(ev: PointerEvent) {
  return { kind: "pointer" as const, ev };
}
export type PointerEv = ReturnType<typeof pointerEv>;
export function mouseEv(ev: PointerEvent) {
  return { kind: "mouse" as const, ev };
}
export type MouseEv = ReturnType<typeof mouseEv>;
export function wheelEv(ev: WheelEvent) {
  return { kind: "wheel" as const, ev };
}
export type WheelEv = ReturnType<typeof wheelEv>;
export function touchEv(ev: TouchEvent) {
  return { kind: "touch" as const, ev };
}
export type TouchEv = ReturnType<typeof touchEv>;

export type DomEvent = PointerEv | MouseEv | WheelEv | TouchEv;

export type Events = {
  onClick: EventListener;
  onContextMenu: EventListener;
  onDoubleClick: EventListener;
  onWheel: EventListener;
  onPointerDown: EventListener;
  onPointerUp: EventListener;
  onPointerLeave: EventListener;
  onPointerMove: EventListener;
  onPointerCancel: EventListener;
  onLostPointerCapture: EventListener;
};

export type EventHandlers = {
  onClick?: (event: IntersectionEvent<MouseEv>) => void;
  onContextMenu?: (event: IntersectionEvent<MouseEv>) => void;
  onDoubleClick?: (event: IntersectionEvent<MouseEv>) => void;
  onPointerUp?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerDown?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerOver?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerOut?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerEnter?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerLeave?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerMove?: (event: IntersectionEvent<PointerEv>) => void;
  onPointerMissed?: (event: MouseEv) => void;
  onPointerCancel?: (event: IntersectionEvent<PointerEv>) => void;
  onWheel?: (event: IntersectionEvent<WheelEv>) => void;
  onTouchStart?: (event: IntersectionEvent<TouchEv>) => void;
  onTouchMove?: (event: IntersectionEvent<TouchEv>) => void;
  onTouchEnd?: (event: IntersectionEvent<TouchEv>) => void;
  onTouchCancel?: (event: IntersectionEvent<TouchEv>) => void;
};

const buttonEventApi: EventHandlers = {
  onTouchStart: (event) => {
    //Prevent the browser from processing emulated mouse events.
    event.nativeEvent.ev.preventDefault();
  },
  onTouchEnd: (event) => {},
  onTouchMove: (event) => {},
  onTouchCancel: (event) => {},
};

const canvasEventApi: EventHandlers = {};

// db of object3d that are interactive, and their event handlers:
export type InteractionCache = {
  [key: string]: {
    eventHandlers: EventHandlers;
  };
};

export const interactionCache = (): InteractionCache => {
  return {};
};

interface InteractionCacheApi {
  register: (
    cache: InteractionCache
  ) => (o: Object3D, eventHandlers: EventHandlers) => void;
  unregister: (cache: InteractionCache) => (o: Object3D) => void;
}

export const interactionCacheApi: InteractionCacheApi = {
  register: (cache) => (o, eventHandlers) => {
    cache[o.uuid] = { eventHandlers: eventHandlers };
  },
  unregister: (cache) => (o) => {},
};

export const interpretEventStream = () => {};
