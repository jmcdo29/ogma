# Change Log

## 5.1.0

### Minor Changes

- 9d848fd: Allow for Nest v11 dependencies

### Patch Changes

- Updated dependencies [9d848fd]
  - @ogma/nestjs-module@5.4.0

## 5.0.1

### Patch Changes

- Updated dependencies [c970428]
  - @ogma/nestjs-module@5.0.1

## 5.0.0

### Major Changes

- 36ff6d0: New parser format and module options

  With the new version, there is no longer a need toseparate the service and interceptor options.As such, the options passed to the module are now the same as those passed to `Ogma` directly **plus** a `traceMethod` property for the `@Log()` decorator.

  As for the parsers that _were_ originally passed to `interceptor.[type]`, they should now be registered directly as providers so that the discovery service can find them on application start.

  ## **FOR ANY CUSTOM EXISTING PARSERS**

  Add the `@Parser()` decorator to your parser and pass in the context in which it should be called. This should match what `context.getType()` or `host.getType()` returns

### Patch Changes

- Updated dependencies [84c799f]
- Updated dependencies [36ff6d0]
  - @ogma/nestjs-module@5.0.0

## 4.0.2

### Patch Changes

- dd5215e: Security updates of dependencies. Should be nothing major here.

## 4.0.1

### Patch Changes

- a4a01af: Fixed the published peer dependencies of each package

## 4.0.0

### Major Changes

- e82c80b: NestJS v9 Support

  ## Features

  - Use the new `ConfigurableModuleBuilder` from `@nestjs/common@9`
  - Support Fastify v4
    - As a side effect, `@ogma/platform-graphql-fastify` can **only** be used with `@nestjs/mercurius` until `apollo-server-fastify` supports v4

  ## How to Upgrade

  Run your preferred pacakge manager's method of ugrading. There's no code chagnes necessary to the ogma imports, but implications of underlying packages that should be taken into consideration

## 3.0.4

### Patch Changes

- e65b9d2: Once again fixing the bad publish

## 3.0.3

### Patch Changes

- b730b78: resolve bad deployment of socket.io package

## 3.0.2

### Patch Changes

- 8973523: Fix the peer dependencies for socket.io and @nestjs/plaltform-socket.io

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

### Patch Changes

- Updated dependencies [5e51fdc]
  - @ogma/nestjs-module@3.0.0

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
  - @ogma/nestjs-module@2.0.0

## 1.0.0

### Major Changes

- bbf66f6: Major release of @ogma

  The `ogma` command has been moved from `@ogma/logger` to `@ogma/cli`. There are no other breaking changes. This change was made to keep the package size as small as possible and to keep the code clean and maintainable.

### Patch Changes

- Updated dependencies [bbf66f6]
  - @ogma/nestjs-module@1.0.0

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.3](https://github.com/jmcdo29/ogma/compare/v0.4.2...v0.4.3) (2020-10-30)

**Note:** Version bump only for package @ogma/platform-socket.io

## [0.4.2](https://github.com/jmcdo29/ogma/compare/v0.4.1...v0.4.2) (2020-10-26)

**Note:** Version bump only for package @ogma/platform-socket.io

## [0.4.1](https://github.com/jmcdo29/ogma/compare/v0.4.0...v0.4.1) (2020-10-25)

**Note:** Version bump only for package @ogma/platform-socket.io

# [0.4.0](https://github.com/jmcdo29/ogma/compare/v0.3.1...v0.4.0) (2020-10-25)

### Features

- **all:** allow to add extra metadata to logs ([f83904d](https://github.com/jmcdo29/ogma/commit/f83904d2e2038c9e09cae8f97a923ec12c4365a0)), closes [#215](https://github.com/jmcdo29/ogma/issues/215) [#228](https://github.com/jmcdo29/ogma/issues/228) [#297](https://github.com/jmcdo29/ogma/issues/297)

### BREAKING CHANGES

- **all:** log methods now take an object as the second parameter instead of having 3 extra optional parameters

## [0.3.1](https://github.com/jmcdo29/ogma/compare/v0.3.0...v0.3.1) (2020-09-12)

**Note:** Version bump only for package @ogma/platform-socket.io

# [0.3.0](https://github.com/jmcdo29/ogma/compare/v0.2.2...v0.3.0) (2020-09-05)

### Features

- **all:** add request id generation and log ([00fd8c7](https://github.com/jmcdo29/ogma/commit/00fd8c7794f546c6265205a1fabfa128fcfb9a83))

## [0.2.2](https://github.com/jmcdo29/ogma/compare/v0.2.1...v0.2.2) (2020-08-10)

**Note:** Version bump only for package @ogma/platform-socket.io

## [0.2.1](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.1) (2020-07-25)

# 0.2.0 (2020-07-20)

**Note:** Version bump only for package @ogma/platform-socket.io

# [0.2.0](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.0) (2020-07-20)

**Note:** Version bump only for package @ogma/platform-socket.io

## [0.1.2](https://github.com/jmcdo29/ogma/compare/v0.1.1...v0.1.2) (2020-07-18)

**Note:** Version bump only for package @ogma/platform-socket.io

## [0.1.1](https://github.com/jmcdo29/ogma/compare/v0.1.0...v0.1.1) (2020-07-18)

### Bug Fixes

- **gql:** updates gql types to work with apollo > 2.11 ([a097842](https://github.com/jmcdo29/ogma/commit/a097842cafdf71a45132c99fe9df2515e41d8c5e))

# [0.1.0](https://github.com/jmcdo29/ogma/compare/v2.0.2...v0.1.0) (2020-04-20)

### Features

- **module:** let base module work for http express ([1bb52a7](https://github.com/jmcdo29/ogma/commit/1bb52a7fa562121f897b03109dfaf8d3b4e5b385))
- **socket.io:** implements parser for socket.io ([6da8fdb](https://github.com/jmcdo29/ogma/commit/6da8fdb79a57bb7639f2330df73743b2e63cc95f)), closes [#22](https://github.com/jmcdo29/ogma/issues/22)
- **ws:** implements parser for websocket ([9de8c96](https://github.com/jmcdo29/ogma/commit/9de8c96ab1b71ca56e73613e2379a6df98187203)), closes [#24](https://github.com/jmcdo29/ogma/issues/24)
