# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/dividab/graphql-norm-stale/compare/v0.6.0...master)

## [v0.6.1](https://github.com/dividab/graphql-norm-stale/compare/v0.6.0...v0.6.1) - 2020-03-29

### Added

- Include typescript source from `src/` in published npm package.

## [0.6.0](https://github.com/dividab/graphql-norm-stale/compare/v0.5.0...v0.6.0) - 2019-10-14

### Changed

- Return both the new stale map and the cleared fields from `clearStale()`. See PR [#3](https://github.com/dividab/graphql-norm-stale/pull/3).

## [0.5.0](https://github.com/dividab/graphql-norm-stale/compare/v0.4.0...v0.5.0) - 2019-10-13

### Added

- Add patches for invlidation/staleness from the graphql-norm-patch package. See PR [#2](https://github.com/dividab/graphql-norm-stale/pull/2) for more info.

### Added

- Add patches for invlidation/staleness from the graphql-norm-patch package. See PR [#2](https://github.com/dividab/graphql-norm-stale/pull/2) for more info.

## [0.4.0](https://github.com/dividab/graphql-norm-stale/compare/v0.3.0...v0.4.0) - 2019-10-13

### Changed

- Use the `FieldsMap` type from `graphql-norm` instead of `StaleMap` and `StaleFields`.
- Rename `updateStale()` to `clearStale()`.

## [0.3.0](https://github.com/dividab/graphql-norm-stale/compare/v0.2.0...v0.3.0) - 2019-10-02

### Added

- Upgrade peer deps. The graphql package now has built-in types so no peer dependency is required for the @types/graphql package.

## [0.2.0](https://github.com/dividab/graphql-norm-stale/compare/v0.1.2...v0.2.0) - 2019-09-29

### Added

- Upgrade dependency to graphql-norm.

## [0.1.2](https://github.com/dividab/graphql-norm-stale/compare/v0.1.1...v0.1.2) - 2019-07-17

### Fixed

- Fix invalid dependencies.

## [0.1.1](https://github.com/dividab/graphql-norm-stale/compare/v0.1.0...v0.1.1) - 2019-07-16

### Fixed

- Fix invalid dependencies.

## [0.1.0](https://github.com/dividab/graphql-norm-stale/compare/...v0.1.0) - 2019-07-16

### Added

- Initial version.
