import * as fs from "fs";

export function loadTests<T>(path: string): ReadonlyArray<T> {
  // eslint-disable-next-line no-path-concat
  const testBasePath = __dirname + "/" + path;
  const importedTests = fs
    .readdirSync(testBasePath)
    // eslint-disable-next-line
    .map(f => require(testBasePath + f))
    .map(importedModule => importedModule.tests as T)
    .flat();

  return importedTests;
}

export interface UtilsTest {
  readonly only?: boolean;
  readonly skip?: boolean;
}

/**
 * Helper function to enable only one test to be run
 * in an array of test data
 */
export function onlySkip<T extends UtilsTest>(
  tests: ReadonlyArray<T>
): ReadonlyArray<T> {
  const skips = tests.filter(t => !t.skip);
  const onlys = skips.filter(t => t.only === true);
  if (onlys.length > 0) {
    return onlys;
  }
  return skips;
}
