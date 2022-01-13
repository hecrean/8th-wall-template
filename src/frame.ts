import { Observable, of } from "rxjs";
import { map, expand, filter, share } from "rxjs/operators";

export interface FrameData {
  frameStartTime: number;
  deltaTime: number;
}

export const clampTo30FPS = (frame: FrameData) => {
  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30;
  }
  return frame;
};

/**
 * This function returns an observable that will emit the next frame once the
 * browser has returned an animation frame step. Given the previous frame it calculates
 * the delta time, and we also clamp it to 30FPS in case we get long frames.
 */
const calculateStep = (prevFrame: FrameData): Observable<FrameData> => {
  return new Observable<FrameData>((observer) => {
    requestAnimationFrame((frameStartTime) => {
      // Millis to seconds
      const deltaTime = prevFrame
        ? (frameStartTime - prevFrame.frameStartTime) / 1000
        : 0;
      observer.next({
        frameStartTime,
        deltaTime,
      });
    });
  }).pipe(map(clampTo30FPS));
};

// This is our core stream of frames. We use expand to recursively call the
//  `calculateStep` function above that will give us each new Frame based on the
//  window.requestAnimationFrame calls. Expand emits the value of the called functions
//  returned observable, as well as recursively calling the function with that same
//  emitted value. This works perfectly for calculating our frame steps because each step
//  needs to know the lastStepFrameTime to calculate the next. We also only want to request
//  a new frame once the currently requested frame has returned.
export const frames$ = of({
  frameStartTime: 0,
  deltaTime: 1 / 60,
}).pipe(
  expand((val) => calculateStep(val)),
  // Expand emits the first value provided to it, and in this
  //  case we just want to ignore the undefined input frame
  filter((frame) => frame !== undefined),
  map((frame: FrameData) => frame.deltaTime),
  share()
);
