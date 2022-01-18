import * as THREE from "three";
import { EventHandlers } from "../event";
import { buttonEventApi } from "./button";
import { InteractionCache, interactionCacheApi } from "../interaction-cache";
import { Mesh, Color, DoubleSide } from "three";

enum UIKinds {
  Button,
  None,
}

export type UIs = Record<
  string,
  {
    kind: UIKinds;
    api: EventHandlers;
    el: Mesh;
  }
>;

export const uiElements = (): UIs => {
  const material1 = new THREE.MeshBasicMaterial({
    color: new Color("green"),
    side: DoubleSide,
  });
  const plane1 = new THREE.PlaneGeometry(2, 2);
  const button1 = new THREE.Mesh(plane1, material1);

  return {
    "ui-button1": { kind: UIKinds.Button, api: buttonEventApi, el: button1 },
  };
};

export const registerUi = (cache: InteractionCache, UIs: UIs) => {
  Object.values(UIs).map((ui) =>
    interactionCacheApi.register(cache)(ui.el, buttonEventApi)
  );
};
