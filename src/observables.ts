import { fromEvent, map, merge } from "rxjs";
import {
  pointercancelEv,
  pointerdownEv,
  pointerenterEv,
  pointermoveEv,
  pointeroutEv,
  pointeroverEv,
  pointerrawupdateEv,
  pointerupEv,
  DomEvent,
} from "./event";
import { Input } from "./input";

const canvasEl: HTMLCanvasElement = document.querySelector("canvas")!;

//observables :
// dom:
const pointerOver$ = fromEvent<PointerEvent>(canvasEl, "pointerover").pipe(
  map(pointeroverEv)
);

const pointerEnter$ = fromEvent<PointerEvent>(canvasEl, "pointerenter").pipe(
  map(pointerenterEv)
);
const pointerdown$ = fromEvent<PointerEvent>(canvasEl, "pointerdown").pipe(
  map(pointerdownEv)
);
const pointermove$ = fromEvent<PointerEvent>(canvasEl, "pointermove").pipe(
  map(pointermoveEv)
);
const pointerrawupdate$ = fromEvent<PointerEvent>(
  canvasEl,
  "pointerrawupdate"
).pipe(map(pointerrawupdateEv));
const pointerup$ = fromEvent<PointerEvent>(canvasEl, "pointerup").pipe(
  map(pointerupEv)
);
const pointercancel$ = fromEvent<PointerEvent>(canvasEl, "pointercancel").pipe(
  map(pointercancelEv)
);
const pointerout$ = fromEvent<PointerEvent>(canvasEl, "pointerout").pipe(
  map(pointeroutEv)
);

export const input$ = merge(
  pointerOver$,
  pointerEnter$,
  pointerdown$,
  pointermove$,
  pointerrawupdate$,
  pointerup$,
  pointercancel$,
  pointerout$
).pipe(map<DomEvent, Input>((dom) => ({ domEvent: dom })));
