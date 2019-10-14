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
 * Removes the stale flag for fields that are present in the normalized result.
 * Returns tupe of new map of stale fields with the cleared fields removed and
 * map of the cleared fields
 */
export function clearStale(
  normMap: NormMap,
  staleMap: FieldsMap
): [FieldsMap, FieldsMap] {
  type MutableFieldsMap = { [key: string]: Set<string> };
  // Make a shallow copy to enable shallow mutation
  const newStaleMap: MutableFieldsMap = { ...(staleMap as MutableFieldsMap) };
  const clearedMap: MutableFieldsMap = {};

  // Check all stale fields against the normalized map
  for (const staleKey of Object.keys(newStaleMap)) {
    const normObj = normMap[staleKey];
    if (normObj !== undefined) {
      const staleFields = newStaleMap[staleKey];
      let staleFieldKeyCount = staleFields.size;

      // Check all fields of the stale set against the corresponding normalized object fields
      // If a field exists in the normalized map, then it should not be stale anymore
      let staleFieldsSetCopy: Set<string> | undefined = undefined;
      let clearedFields: Set<string> | undefined = undefined;
      for (const staleField of staleFields) {
        for (const normField of Object.keys(normObj)) {
          if (normField === staleField) {
            if (!staleFieldsSetCopy) {
              staleFieldsSetCopy = new Set(staleFields);
              newStaleMap[staleKey] = staleFieldsSetCopy;
            }
            if (!clearedFields) {
              clearedFields = new Set();
              clearedMap[staleKey] = clearedFields;
            }
            staleFieldsSetCopy.delete(staleField);
            staleFieldKeyCount--;
            clearedFields.add(staleField);
          }
        }
      }

      // If the normalized object has no stale fields then remove it from stale
      if (staleFieldKeyCount === 0) {
        delete newStaleMap[staleKey];
      }
    }
  }
  return [newStaleMap, clearedMap];
}
