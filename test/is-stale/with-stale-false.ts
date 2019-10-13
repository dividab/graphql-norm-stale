import { OneTest } from "../is-stale-test-def";

export const tests: ReadonlyArray<OneTest> = [
  {
    name: "with stale false",
    staleMap: {
      "Post;555": new Set(["author", "title", "comments"])
    },
    fields: {
      ROOT_QUERY: ["posts"],
      "Post;123": ["id", "__typename", "author", "title", "comments"],
      "Author;1": ["id", "__typename", "name"]
    },
    isStale: false
  }
];
