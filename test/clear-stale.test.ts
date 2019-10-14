import { tests } from "./clear-stale-data";
import { onlySkip } from "./test-data-utils";
import { clearStale } from "../src/stale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepFreeze(o: any): any {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (
      // eslint-disable-next-line
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === "object" || typeof o[prop] === "function") &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

describe("clearStale() with test data", () => {
  onlySkip(tests).forEach(item => {
    test(item.name, done => {
      // Freeze the test so we test that the function does not mutate the inputs on any level
      deepFreeze(item);
      const [newStale, clearedFields] = clearStale(
        item.normMap,
        item.staleBefore
      );
      expect(newStale).toEqual(item.staleAfter);
      expect(clearedFields).toEqual(item.clearedAfter);
      done();
    });
  });
});
