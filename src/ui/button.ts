import { EventHandlers } from "../event";
import {} from "../main";

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
