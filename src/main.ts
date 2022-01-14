import "./style.css";

// import { loadAr } from "./ar-module-pipeline";

// loadAr();

import { update, responseToInput } from "./three-scene";
import { synchroniseState, initRenderCxt, initSceneGraphCtx } from "./state";
import { input$ } from "./event";

const state = synchroniseState(initRenderCxt(), initSceneGraphCtx());
update(state);
input$.subscribe((input) => responseToInput(input, state));
console.log(state[1].interactionCache);

// import { run } from "./state";

// run();

// console.log("running___");
