import AtomicState from "@tolokoban/react-state";
import { isString } from "@tolokoban/type-guards";

export const State = {
  signalServer: new AtomicState("http://localhost:55555", {
    storage: {
      id: "signalServer",
      guard: isString,
    },
  }),
};
