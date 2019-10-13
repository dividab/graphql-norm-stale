import { OneTest } from "../clear-stale-def";

/**
 * When there is no fields left, the object should be removed from stale
 */
export const test: OneTest = {
  name: "remove last field",
  normMap: { myid: { id: "myid", name: "foo" } },
  staleBefore: { myid: new Set(["name"]) },
  staleAfter: {}
};
