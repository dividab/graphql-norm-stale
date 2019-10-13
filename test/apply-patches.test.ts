import { tests } from "./apply-patches-test-data";
import { onlySkip } from "./test-data-utils";
import { applyPatches } from "../src";

describe("applyPatches", () => {
  onlySkip(tests).forEach(testCase => {
    test(testCase.name, done => {
      const actualStale = applyPatches(
        testCase.patches,
        testCase.cacheBefore,
        testCase.staleBefore || {}
      );
      expect(actualStale).toEqual(testCase.staleAfter || {});
      done();
    });
  });
});
