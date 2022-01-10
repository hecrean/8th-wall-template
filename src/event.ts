import THREE, { Vector2 } from "three";

/**
 * keyboard events, chunks of data from websocket, jobs in a worker queue, etc.
 */

export type PointerEvents =
  | "pointerover"
  | "pointerenter"
  | "pointerdown"
  | "pointermove"
  | "pointerrawupdate"
  | "pointerup"
  | "pointercancel"
  | "pointerout"
  | "pointerleave";

export type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

export interface Intersection extends THREE.Intersection {
  eventObject: THREE.Object3D;
}

export interface IntersectionEvent<TSourceEvent> extends Intersection {
  intersections: Intersection[];
  stopped: boolean;
  unprojectedPoint: THREE.Vector3;
  ray: THREE.Ray;
  camera: Camera;
  stopPropagation: () => void;
  nativeEvent: TSourceEvent;
  delta: number;
  spaceX: number;
  spaceY: number;
}

export type ThreeEvent<TEvent> = IntersectionEvent<TEvent>;
export type DomEvent = PointerEvent | MouseEvent | WheelEvent;

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
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (event: ThreeEvent<MouseEvent>) => void;
  onDoubleClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerUp?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerEnter?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerLeave?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMissed?: (event: MouseEvent) => void;
  onPointerCancel?: (event: ThreeEvent<PointerEvent>) => void;
  onWheel?: (event: ThreeEvent<WheelEvent>) => void;
};
