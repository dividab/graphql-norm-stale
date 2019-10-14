import { NormMap, FieldsMap } from "graphql-norm";

export interface OneTest {
  readonly name: string;
  readonly only?: boolean;
  readonly skip?: boolean;
  readonly normMap: NormMap;
  readonly staleBefore: FieldsMap;
  readonly staleAfter: FieldsMap;
  readonly clearedAfter: FieldsMap;
}
