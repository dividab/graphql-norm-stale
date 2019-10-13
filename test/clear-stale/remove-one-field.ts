import { OneTest } from "../clear-stale-def";

export const tests: ReadonlyArray<OneTest> = [
  {
    name: "remove one field",
    normMap: { myid: { id: "myid", name: "foo" } },
    staleBefore: { myid: new Set(["name", "age"]) },
    staleAfter: { myid: new Set(["age"]) }
  }
];
