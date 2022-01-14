import { fromEvent, map, merge, Observable } from "rxjs";
import { CavnasEventADT, CanvasEvents } from "./event";
import { Input } from "./input";
import { match, __, not, select, when } from "ts-pattern";
import { EventADT } from "./types/dom/event";

const canvasEl: HTMLCanvasElement = document.querySelector("canvas")!;

//observables :

const x = fromEvent<PointerEvent>(canvasEl, "pointerover");

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

// type HTMLElementEvent<K extends keyof HTMLElementEventMap> = {
//   kind: K;
//   ev: HTMLElementEventMap[K];
// };

// type HTMLElementObservables<K> = K extends keyof HTMLElementEventMap ? {[key in K]: HTMLElementEvent<K>} : never;

export const input$ = merge(
  // pointerOver$,
  // pointerEnter$,
  pointerdown$
  // pointermove$,
  // pointerrawupdate$,
  // pointerup$,
  // pointercancel$,
  // pointerout$
).pipe(map<DomEvent, Input>((dom) => ({ domEvent: dom })));
