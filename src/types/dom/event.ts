import { fromEvent, map, merge, Observable, throttle, interval } from "rxjs";

// type CanvasElement = MatchElementTagName<"canvas">;
// type CanvasEventADT = HTMLElementsEventADT<"canvas">;

// type Observables<T extends string> = {
//   [K in keyof MatchElementTagName<T>["_eventMap"] &
//     string as `${K}$`]: Observable<{
//     tag: K;
//     element: MatchElementTagName<T>["_element"];
//     event: MatchElementTagName<T>["_eventMap"][K];
//   }>;
// };

// type CanvasObservableADT = Observables<"canvas">;

type CanvasEventName = keyof HTMLElementEventMap;
type EventFromCanvasEventTag<K extends CanvasEventName> =
  HTMLElementEventMap[K];

type CanvasEvent<K extends CanvasEventName> = {
  tag: K;
  element: HTMLCanvasElement;
  event: HTMLElementEventMap[K];
};

declare const canvasEl: HTMLCanvasElement;

const observable = <K extends CanvasEventName>(
  canvasEl: HTMLCanvasElement,
  tag: K
): Observable<CanvasEvent<K>> => {
  return fromEvent<EventFromCanvasEventTag<K>>(canvasEl, tag).pipe(
    map((ev) => ({ tag: tag, element: canvasEl, event: ev }))
  );
};

const keydown$ = observable(canvasEl, "keydown");
const keypress$ = observable(canvasEl, "keypress");
const keyup$ = observable(canvasEl, "keyup");
const lostpointercapture$ = observable(canvasEl, "lostpointercapture");
const pause$ = observable(canvasEl, "pause");
const play$ = observable(canvasEl, "play");
const playing$ = observable(canvasEl, "playing");
const pointercancel$ = observable(canvasEl, "pointercancel");
const pointerdown$ = observable(canvasEl, "pointerdown");
const pointerenter$ = observable(canvasEl, "pointerenter");
const pointerleave$ = observable(canvasEl, "pointerleave");
const pointermove$ = observable(canvasEl, "pointermove");
const pointerout$ = observable(canvasEl, "pointerout");
const pointerover$ = observable(canvasEl, "pointerover");
const pointerup$ = observable(canvasEl, "pointerup");
const touchcancel$ = observable(canvasEl, "touchcancel");
const touchend$ = observable(canvasEl, "touchend");
const touchmove$ = observable(canvasEl, "touchmove");
const touchstart$ = observable(canvasEl, "touchstart");
const volumechange$ = observable(canvasEl, "volumechange");
const wheel$ = observable(canvasEl, "wheel");

type Input = {
  canvasEvent: CanvasEvent<CanvasEventName>;
};
export const input$ = merge(
  pointerover$,
  pointerenter$,
  pointerleave$,
  pointerdown$,
  pointermove$.pipe(throttle((_) => interval(1000))),
  pointerup$,
  pointercancel$,
  pointerout$
).pipe(
  map<CanvasEvent<CanvasEventName>, Input>((canvasEv) => ({
    canvasEvent: canvasEv,
  }))
);

// type NonEmptyArray<K> = [K, ...K[]]

// const events: NonEmptyArray<keyof HTMLElementEventMap> = [
//   "keydown",
//   "keypress",
//   "keyup",
//   "lostpointercapture",
//   "pause",
//   "play",
//   "playing",
//   "pointercancel",
//   "pointerdown",
//   "pointerenter",
//   "pointerleave",
//   "pointermove",
//   "pointerout",
//   "pointerover",
//   "pointerup",
//   "touchcancel",
//   "touchend",
//   "touchmove",
//   "touchstart",
//   "volumechange",
//   "wheel",
// ];

// type CanvasObservables<K extends keyof HTMLElementEventMap> = {
//   [key in K]: Observable<{
//     tag: K;
//     element: HTMLCanvasElement;
//     event: HTMLElementEventMap[K];
//   }>;
// }

// const createCanvasObservables = <K extends keyof HTMLElementEventMap>(
//   canvasEl: HTMLCanvasElement,
//   events: [K, ...K[]]
// ) => {
//   return events.reduce<CanvasObservables<K>>(
//     (dictionary, newEntry) => ({
//       ...dictionary,
//       [newEntry]: canvasObservable(canvasEl, newEntry),
//     }),
//     {} as CanvasObservables<K>
//   );
// };
// const $observables = createCanvasObservables(canvasEl, events)
