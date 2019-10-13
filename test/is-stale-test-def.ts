import { FieldsMap } from "graphql-norm";

export interface OneTest {
  readonly name: string;
  readonly only?: boolean;
  readonly skip?: boolean;
  readonly fields: { readonly [key: string]: ReadonlyArray<string> };
  readonly staleMap: FieldsMap;
  readonly isStale: boolean;
}
