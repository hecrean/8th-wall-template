import "./style.css";

// import { loadAr } from "./ar-module-pipeline";

// loadAr();

import { update, responseToInput } from "./three-scene";
import { synchroniseState, initRenderCxt, initSceneGraphCtx } from "./state";
import { input$ } from "./observables";

const objStatus = threeObject(new Mesh());
console.log(objStatus);

const state = synchroniseState(initRenderCxt(), initSceneGraphCtx());
console.log("top level STATE", state);

update(state);

input$.subscribe((input) => responseToInput(input, state));

// import { run } from "./state";

// run();

// console.log("running___");
