# graphql-norm-stale

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

Staleness tracking for normalized GraphQL responses

## How to install

```
npm install graphql-norm-stale --save
```

## Introduction

When caching several normalized graphql responses it is sometimes helpful to mark some entries in the cache as stale. This package helps with tracking of stale entries.

## Example usage

```js
import { normalize, denormalize, merge } from "graphql-norm";
import { request } from "graphql-request";

// A plain JS object to hold the normalized responses
let cache = {};

const query = gql`
  query TestQuery {
    posts {
      id
      __typename
      title
      author {
        id
        __typename
        name
      }
      comments {
        id
        __typename
        commenter {
          id
          __typename
          name
        }
      }
    }
  }
`;

// Make a request to fetch the data
const response = request(query);

// Normalize the response
const normalizedResponse = normalize(query, {}, response);

// Merge the normalized response into the cache
cache = merge(cache, normalizedResponse);

// Later when we want to read a query from the cache
const cachedResponse = denormalize(query, {}, cache);
```

## API

### isStale()

The isStale() function takes a map of stale fields and a map of fields and checks if the fields are among the stale entries. The stale field map contains another map of fields for each key. This secondary map can only have entries with value true. The reason a map is used instead of an array is to have faster checking of membership of fields.

```ts
isStale(staleMap: FieldsMap, fields: FieldsMap): boolean
```

### clearStale()

The `clearStale()` function takes a map of normalized GraphQL objects and a map of stale fields. It removes any fields in the staleness map that are present in the normalized map.

```ts
clearStale(normMap: NormMap, staleMap: FieldsMap): FieldsMap
```

### invalidateEntity()

Creates a patch for invalidation of an entity.

### invalidateField()

Creates a patch for invalidation of an entity's field.

### applyPatches()

Returns a new map of stale fields with the patches applied. It needs the `normMap` in order to do recursive patches.

```ts
applyPatches(normMap: NormMap, staleMap: FieldsMap): FieldsMap
```

## Related packages

- [graphql-norm](https://www.npmjs.com/package/graphql-norm)

## How to develop

Node version >=12.6.0 is needed for development.

To execute the tests run `yarn test`.

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

[version-image]: https://img.shields.io/npm/v/graphql-norm-stale.svg?style=flat
[version-url]: https://www.npmjs.com/package/graphql-norm-stale
[travis-image]: https://travis-ci.com/dividab/graphql-norm-stale.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/dividab/graphql-norm-stale
[codecov-image]: https://codecov.io/gh/dividab/graphql-norm-stale/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/dividab/graphql-norm-stale
[license-image]: https://img.shields.io/github/license/dividab/graphql-norm-stale.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
