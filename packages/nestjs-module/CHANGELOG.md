# Change Log

## 3.1.0

### Minor Changes

- 384fc2b: Extra metadata can now be logged in interceptors by using a custom parser and the `getMeta` method

## 3.0.1

### Patch Changes

- 329f92a: Set the main file in the package.json correctly based on the proper publish method

## 3.0.0

### Major Changes

- 5e51fdc: Update package versions to work with Nest v8

  # Breaking Changes

  For `@ogma/nestjs-module` and all of the `@ogma/platform-*` packages, Nest v8 is the supported package version. Nest v7 may still continue to work, but has no guarantees. Also, RxJS is upgraded to v7 to stay inline with Nest's expectations.

  # Why the change was made

  To stay current with Nest.

  # How to upgrade

  Upgrade with Nest v8. There shouldn't be any breaking underlying changes, but you can never be too careful with coded upgrades.

## 2.0.2

### Patch Changes

- Updated dependencies [90d2d53]
  - @ogma/logger@2.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [85fd2f4]
  - @ogma/logger@2.0.1

## 2.0.0

### Major Changes

- 8bea02f: Release of `@ogma/common` and `@ogma/styler`. Upgrade `@ogma/nestjs-module` to be 100% compatible with Nest's logger

  # Breaking Changes

  - `@ogma/logger` now depends on `@ogma/common` and `@ogma/styler` for types and string styling, instead of managing it on its own
  - `@ogma/nestjs-module` now accepts `trace` as the second parameter to `error` instead of `context`. `meta` can still be passed as a second parameter too or it can be a third parameter.
  - `@ogma/logger` now sets an `ool` property when logging in JSON mode to accommodate when using a custom log map
  - `@ogma/logger` no longer needs the `stream` property to have a `hasColor` function
  - `@ogma/cli` now reads from the `ool` property instead `level` to allow writing back to Ogma's standard format

  # Features

  - `@ogma/logger` now correctly logs Error objects the same way `process.stdout` does instead of logging `{}`
  - `@ogma/logger` can accept a `levelMap` property for custom level mapping
  - `@ogma/logger`'s `stream` option can now have a `getColorDepth` property method, but it is not necessary

  # Why

  I wanted to be able to have full control over string styles and this gave me a great chance to learn about SGRs and how they work. Along with that, this gave me the perfect opportunity to make some changes to the logger to be more compliant with Nest's logger and have better compatibility with it.

  # How to Upgrade

  I tried to make this is painless as possible in terms of breaking changes. For the most part, you should just be able to upgrade with no problems. If you have a stream with `hasColor` you will need to remove that method. You may want to add in the `getColorDepth` method, but can also just use `FORCE_COLOR` if necessary.

### Patch Changes

- Updated dependencies [8bea02f]
  - @ogma/common@1.0.0
  - @ogma/logger@2.0.0
  - @ogma/styler@1.0.0

## 1.0.0

### Major Changes

- bbf66f6: Major release of @ogma

  The `ogma` command has been moved from `@ogma/logger` to `@ogma/cli`. There are no other breaking changes. This change was made to keep the package size as small as possible and to keep the code clean and maintainable.

### Patch Changes

- Updated dependencies [bbf66f6]
  - @ogma/logger@1.0.0

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.3](https://github.com/jmcdo29/ogma/compare/v0.4.2...v0.4.3) (2020-10-30)

### Features

- **interceptor:** `getRequestId` now optionally accepts ExecutionContext ([130b9e6](https://github.com/jmcdo29/ogma/commit/130b9e6a773e78a356d9d3f07670e8296858f236)), closes [#326](https://github.com/jmcdo29/ogma/issues/326)

## [0.4.2](https://github.com/jmcdo29/ogma/compare/v0.4.1...v0.4.2) (2020-10-26)

**Note:** Version bump only for package @ogma/nestjs-module

## [0.4.1](https://github.com/jmcdo29/ogma/compare/v0.4.0...v0.4.1) (2020-10-25)

### Bug Fixes

- **service:** fixes logger methods to follow `LoggerService` interface ([f1fd191](https://github.com/jmcdo29/ogma/commit/f1fd191d068182293af8261986ce43b442bb95ca))

# [0.4.0](https://github.com/jmcdo29/ogma/compare/v0.3.1...v0.4.0) (2020-10-25)

### Features

- **all:** allow to add extra metadata to logs ([f83904d](https://github.com/jmcdo29/ogma/commit/f83904d2e2038c9e09cae8f97a923ec12c4365a0)), closes [#215](https://github.com/jmcdo29/ogma/issues/215) [#228](https://github.com/jmcdo29/ogma/issues/228) [#297](https://github.com/jmcdo29/ogma/issues/297)

### BREAKING CHANGES

- **all:** log methods now take an object as the second parameter instead of having 3 extra optional parameters

## [0.3.1](https://github.com/jmcdo29/ogma/compare/v0.3.0...v0.3.1) (2020-09-12)

### Features

- **module:** adds a `forFeatures` method to the module ([e7f5df1](https://github.com/jmcdo29/ogma/commit/e7f5df1aab4e9f5b49861b08ed4654bc8dae44dc))

# [0.3.0](https://github.com/jmcdo29/ogma/compare/v0.2.2...v0.3.0) (2020-09-05)

### Bug Fixes

- **module:** add requestId check to printMessage ([97bcda7](https://github.com/jmcdo29/ogma/commit/97bcda716d950b32216fa5e1cc939794fb012340))

### Features

- **all:** add request id generation and log ([00fd8c7](https://github.com/jmcdo29/ogma/commit/00fd8c7794f546c6265205a1fabfa128fcfb9a83))
- **module:** remove registration of global interceptor ([fdf5ef7](https://github.com/jmcdo29/ogma/commit/fdf5ef72473efec475e833242a5d26878cb7f563))

## [0.2.2](https://github.com/jmcdo29/ogma/compare/v0.2.1...v0.2.2) (2020-08-10)

**Note:** Version bump only for package @ogma/nestjs-module

## [0.2.1](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.1) (2020-07-25)

### Bug Fixes

- **all:** fixes OgmaCoreModule not configured ([c7cd6d7](https://github.com/jmcdo29/ogma/commit/c7cd6d75340e4520153c57e9bd49b4f675292874)), closes [#106](https://github.com/jmcdo29/ogma/issues/106)

### Features

- **module:** adds export for `createProviderToken` ([9b0b43f](https://github.com/jmcdo29/ogma/commit/9b0b43f75030cdf9f071c17493a37f4809c18061))

# 0.2.0 (2020-07-20)

# [0.2.0](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.0) (2020-07-20)

**Note:** Version bump only for package @ogma/nestjs-module

## [0.1.2](https://github.com/jmcdo29/ogma/compare/v0.1.1...v0.1.2) (2020-07-18)

### Bug Fixes

- **module:** updates decorators type to accept a class ([1bc3df7](https://github.com/jmcdo29/ogma/commit/1bc3df76ba5f4d66752cd44ab8c34b72843f3292))

## [0.1.1](https://github.com/jmcdo29/ogma/compare/v0.1.0...v0.1.1) (2020-07-18)

### Bug Fixes

- **gql:** updates gql types to work with apollo > 2.11 ([a097842](https://github.com/jmcdo29/ogma/commit/a097842cafdf71a45132c99fe9df2515e41d8c5e))

# [0.1.0](https://github.com/jmcdo29/ogma/compare/v2.0.2...v0.1.0) (2020-04-20)

### Bug Fixes

- **interceptor:** adds case to skip over graphql subscriptions ([1e35310](https://github.com/jmcdo29/ogma/commit/1e35310dcc4f123e6768983779f009340bb9d96e))

### Features

- **gql:** implements gql parser for express ([9290504](https://github.com/jmcdo29/ogma/commit/9290504171b32319c73e1ee84c969ef9947a1172)), closes [#14](https://github.com/jmcdo29/ogma/issues/14)
- **module:** implements plugin system for interceptor context parser ([d116da3](https://github.com/jmcdo29/ogma/commit/d116da3c0512909e08ddd2a22960a30937bf4bad)), closes [#7](https://github.com/jmcdo29/ogma/issues/7) [#8](https://github.com/jmcdo29/ogma/issues/8) [#9](https://github.com/jmcdo29/ogma/issues/9) [#10](https://github.com/jmcdo29/ogma/issues/10) [#11](https://github.com/jmcdo29/ogma/issues/11)
- **module:** let base module work for http express ([1bb52a7](https://github.com/jmcdo29/ogma/commit/1bb52a7fa562121f897b03109dfaf8d3b4e5b385))
