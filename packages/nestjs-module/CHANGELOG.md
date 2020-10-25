# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
