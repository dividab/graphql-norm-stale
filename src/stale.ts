import { NormMap, FieldsMap } from "graphql-norm";

/**
 * Checks if any of the provided fields are stale
 */
export function isStale(staleMap: FieldsMap, fields: FieldsMap): boolean {
  for (const key of Object.keys(fields)) {
    for (const field of fields[key]) {
      const staleObj = staleMap[key];
      if (staleObj && staleObj.has(field)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Removes the stale flag for fields that are present in the normalized result
 */
export function clearStale(normMap: NormMap, staleMap: FieldsMap): FieldsMap {
  type MutableFieldsMap = { [key: string]: Set<string> };
  // Make a shallow copy to enable shallow mutation
  const staleCopy: MutableFieldsMap = { ...(staleMap as MutableFieldsMap) };

  // Check all stale fields against the normalized map
  for (const staleKey of Object.keys(staleCopy)) {
    const normObj = normMap[staleKey];
    if (normObj !== undefined) {
      const staleFields = staleCopy[staleKey];
      let staleFieldKeyCount = staleFields.size;

      // Check all fields of the stale against the corresponding normalized object fields
      // If a field exists in the normalized map, then it should not be stale anymore
      let staleFieldsCopy: Set<string> | undefined = undefined;
      for (const staleFieldKey of staleFields) {
        for (const normField of Object.keys(normObj)) {
          if (normField === staleFieldKey) {
            if (!staleFieldsCopy) {
              staleFieldsCopy = new Set(staleFields);
              staleCopy[staleKey] = staleFieldsCopy;
            }
            staleFieldsCopy.delete(staleFieldKey);
            staleFieldKeyCount--;
          }
        }
      }

      // If the normalized object has no stale fields then remove it from stale
      if (staleFieldKeyCount === 0) {
        delete staleCopy[staleKey];
      }
    }
  }
  return staleCopy;
}
