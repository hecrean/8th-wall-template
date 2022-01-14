import { EventHandlers } from "../event";
import {} from "../utils";

export const buttonEventApi: EventHandlers = {
  onTouchStart: (event) => {
    //Prevent the browser from processing emulated mouse events.
    event.nativeEvent.ev.preventDefault();
  },
  onTouchEnd: (event) => {},
  onTouchMove: (event) => {},
  onTouchCancel: (event) => {},
  onPointerDown: (event) => {
    console.log("-button event firing");
    event.object;
    event.object.position.x += 2;
  },
};

const canvasEventApi: EventHandlers = {};
