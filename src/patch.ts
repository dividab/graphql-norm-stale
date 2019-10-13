import {
  NormMap,
  FieldsMap,
  NormFieldValue,
  NormKey,
  NormObj
} from "graphql-norm";

export type Patch = InvalidateEntity | InvalidateField;

export interface InvalidateEntity {
  readonly type: "InvalidateEntity";
  readonly id: string;
  readonly recursive: boolean;
}

export interface InvalidateField {
  readonly type: "InvalidateField";
  readonly id: string;
  readonly fieldName: string;
  readonly recursive: boolean;
  readonly fieldArguments: {} | undefined;
}

/**
 *  Makes an entity stale in the cache
 */
export function invalidateEntity(
  id: NormKey,
  recursive: boolean
): InvalidateEntity {
  return {
    type: "InvalidateEntity",
    id,
    recursive
  };
}

/**
 *  Makes a field stale in the cache
 */
export function invalidateField<T = NormObj, A extends {} = {}>(
  id: NormKey,
  fieldName: Extract<keyof T, string>,
  recursive: boolean,
  fieldArguments?: A
): InvalidateField {
  return {
    type: "InvalidateField",
    id,
    fieldName,
    recursive,
    fieldArguments
  };
}

// eslint-disable-next-line functional/prefer-readonly-type
type MutableFieldsMap = { [key: string]: Set<string> };

export function applyPatches(
  patches: ReadonlyArray<Patch>,
  cache: NormMap,
  staleMap: FieldsMap
): FieldsMap {
  if (patches.length === 0) {
    return staleMap;
  }
  // Make a shallow copy of the stale entities
  const staleEntitiesCopy: MutableFieldsMap = {
    ...(staleMap as MutableFieldsMap)
  };
  for (const patch of patches) {
    switch (patch.type) {
      case "InvalidateEntity": {
        applyInvalidateEntity(patch, cache, staleEntitiesCopy);
        break;
      }
      case "InvalidateField": {
        applyInvalidateField(patch, cache, staleEntitiesCopy);
        break;
      }
      default: {
        const exhaustiveCheck = (x: never): void => x;
        exhaustiveCheck(patch);
      }
    }
  }

  return staleEntitiesCopy;
}

function applyInvalidateEntity(
  patch: InvalidateEntity,
  cache: NormMap,
  staleEntities: MutableFieldsMap
): void {
  const entity = cache[patch.id];
  if (entity !== undefined) {
    const newStaleEntity: Set<string> = new Set(staleEntities[patch.id]);
    for (const entityKey of Object.keys(entity)) {
      newStaleEntity.add(entityKey);
      if (patch.recursive) {
        invalidateRecursive(cache, staleEntities, entity[entityKey]);
      }
    }
    staleEntities[patch.id] = newStaleEntity;
  }
}

function applyInvalidateField(
  patch: InvalidateField,
  cache: NormMap,
  staleEntities: MutableFieldsMap
): void {
  if (cache[patch.id] !== undefined) {
    // We want to invalidate all fields that start with the specified
    // field name in order to invlidate fields with arguments
    // For example the fields "products" and "products(ids: [1, 2])" should
    // both be invalidated if the field name "products" is specified
    const entityFieldKeys = Object.keys(cache[patch.id]).filter(
      k => k.indexOf(withArgs(patch.fieldName, patch.fieldArguments)) !== -1
    );

    if (entityFieldKeys.length === 0) {
      return;
    }

    for (const fieldKey of entityFieldKeys) {
      const existingFields = staleEntities[patch.id] || [];
      staleEntities[patch.id] = new Set([...existingFields, fieldKey]);
      if (patch.recursive) {
        // Shallow mutation of stale entities OK as we have a shallow copy
        invalidateRecursive(cache, staleEntities, cache[patch.id][fieldKey]);
      }
    }
  }
}

function invalidateRecursive(
  cache: NormMap,
  staleEntities: MutableFieldsMap,
  startingEntity: NormFieldValue | null
): void {
  if (
    typeof startingEntity === "number" ||
    typeof startingEntity === "boolean" ||
    startingEntity === "undefined" ||
    startingEntity === "null"
  ) {
    return;
  }

  const stack: Array<string> = [];

  if (typeof startingEntity === "string" && cache[startingEntity]) {
    stack.push(startingEntity);
  } else if (isArrayOfEntityIds(cache, startingEntity)) {
    stack.push(...startingEntity);
  }

  while (stack.length > 0) {
    const entityId = stack.shift()!;
    const entity = cache[entityId];
    if (entity === undefined) {
      continue;
    }
    const entityFieldKeys = Object.keys(entity);
    const newStaleEntity: Set<string> = new Set(staleEntities[entityId]);

    for (const entityFieldKey of entityFieldKeys) {
      const entityField = entity[entityFieldKey];
      if (isArrayOfEntityIds(cache, entityField)) {
        stack.push(...entityField.filter(id => !staleEntities[id]));
      } else if (
        typeof entityField === "string" &&
        cache[entityField] &&
        !staleEntities[entityField]
      ) {
        stack.push(entityField);
      }
      newStaleEntity.add(entityFieldKey);
    }

    staleEntities[entityId] = newStaleEntity;
  }
}

function withArgs(fieldName: string, fieldArguments: {} | undefined): string {
  if (fieldArguments === undefined) {
    return fieldName;
  }
  const hashedArgs = JSON.stringify(fieldArguments);
  return fieldName + "(" + hashedArgs + ")";
}

function isArrayOfEntityIds(
  cache: NormMap,
  field: NormFieldValue | null
): field is ReadonlyArray<NormKey> {
  if (Array.isArray(field) && field.some(x => !!cache[x])) {
    return true;
  }

  return false;
}
