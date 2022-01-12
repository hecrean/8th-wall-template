import * as THREE from "three";
import { DomEvent } from "./event";

export type Input = {
  domEvent: DomEvent;
};

export const input = (): Input => {
  return {
    domEvent: [],
  };
};
