# Change Log

## 3.0.0

### Major Changes

- fa89834: Major performance boosts

  - Stringified objects with `Symbol`s now have the Symbol output as `Symbol: description` instead of `Symbol(description)`
  - `BigInt`s are now handled in the stringification
  - no longer 0 non-`@ogma/` deps
  - time is now output in milliseconds since epoch in JSON format
  - JSON logs keep the `.message` property even in the case of logging objects
  - default stream in Node environments now uses `sonic-boom` instead of `process.stdout`

  - Unification of how objects get stringified to make all non-standard properties act the same.
  - speed. Using `toISOString()` is a bit slow. Fast enough for the string format but wanted to speed up JSON just a tiny bit more, plus it's supposed to be machine readable more than anything
  - By keeping the `.message` property, even in the case of objects we're able to eliminate an if check and keep the speeds up on the JSON logging. Also, gives a defined proeprty that the user defined message will **always** be at

  Mostly, everything should be handled under the hood, it's more of just new deps and format changes to be aware of.

### Patch Changes

- Updated dependencies [be1367c]
  - @ogma/common@1.2.0

## 2.5.2

### Patch Changes

- 1c2854e: Fixed issues 1634 - Verbose logging bad printing

## 2.5.1

### Patch Changes

- dd5215e: Security updates of dependencies. Should be nothing major here.
- Updated dependencies [dd5215e]
  - @ogma/common@1.1.1
  - @ogma/styler@1.0.1

## 2.5.0

### Minor Changes

- 8370e11: Allow for `each` to be set at a global level when initializing an Ogma instance

## 2.4.2

### Patch Changes

- 33c279b: Fix dependencies for better install experience

  ## `@ogma/logger`

  `@ogma/common` and `@ogma/styler` were set as peerDependencies instead of dependencies meaning package managers wouldn't install them by default. They are now properly set as dependencies

  ## `@ogma/nestjs-module`

  `@ogma/logger` was set as a peerDependency instead of a dependency. Now has been set to a dependency.

## 2.4.1

### Patch Changes

- 2e65080: Update {each: true } to separate via space, not newline

  [Read up on the discussion here](https://github.com/jmcdo29/ogma/discussions/1381)

## 2.4.0

### Minor Changes

- 2f5ccce: Allow for printing of each array value

## 2.3.0

### Minor Changes

- d2cbc49: added ability to modify logger message (remove pid, application, hostname)

## 2.2.0

### Minor Changes

- 33061ad: Adds the ability to mask values of an object while logging based on an initial array config

  A `masks` property can now be passed to the `Ogma` constructor. This property is an array, and will be checked against the keys of an object that Ogma is logging. If the key matches a value in the array, Ogma will replace the value with a string of asterisks (`*`) matching the length of the original string.

  e.g.

  ```
  ogma.log({ password: '12345' })
  ```

  will log the object

  ```
  {
    password: '*****'
  }
  ```

## 2.1.0

### Minor Changes

- 90d2d53: add 'levelKey' option

## 2.0.1

### Patch Changes

- 85fd2f4: Ogma no longer assigns \`getColorDepth\` if `options.stream` is `process.stdout`

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
  - @ogma/styler@1.0.0

## 1.0.0

### Major Changes

- bbf66f6: Major release of @ogma

  The `ogma` command has been moved from `@ogma/logger` to `@ogma/cli`. There are no other breaking changes. This change was made to keep the package size as small as possible and to keep the code clean and maintainable.

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.2](https://github.com/jmcdo29/ogma/compare/v0.4.1...v0.4.2) (2020-10-26)

### Bug Fixes

- OFF means no logs ([bde8068](https://github.com/jmcdo29/ogma/commit/bde80689453b4339fc2180f5593d00117825b3f0))

### Features

- **logger:** move log level to earlier in the log ([da00caa](https://github.com/jmcdo29/ogma/commit/da00caa0060371725d513e1d2eb1d1be0657b230))

# [0.4.0](https://github.com/jmcdo29/ogma/compare/v0.3.1...v0.4.0) (2020-10-25)

### Features

- **all:** allow to add extra metadata to logs ([f83904d](https://github.com/jmcdo29/ogma/commit/f83904d2e2038c9e09cae8f97a923ec12c4365a0)), closes [#215](https://github.com/jmcdo29/ogma/issues/215) [#228](https://github.com/jmcdo29/ogma/issues/228) [#297](https://github.com/jmcdo29/ogma/issues/297)

### BREAKING CHANGES

- **all:** log methods now take an object as the second parameter instead of having 3 extra optional parameters

## [0.3.1](https://github.com/jmcdo29/ogma/compare/v0.3.0...v0.3.1) (2020-09-12)

### Features

- **logger:** logger will not print function names when objects have funcs ([c496d16](https://github.com/jmcdo29/ogma/commit/c496d163d94dca5d15205b1f79648d11f05550ff))

# [0.3.0](https://github.com/jmcdo29/ogma/compare/v0.2.2...v0.3.0) (2020-09-05)

### Features

- **all:** add request id generation and log ([00fd8c7](https://github.com/jmcdo29/ogma/commit/00fd8c7794f546c6265205a1fabfa128fcfb9a83))

## [0.2.2](https://github.com/jmcdo29/ogma/compare/v0.2.1...v0.2.2) (2020-08-10)

### Features

- **logger:** logs Symbol(name) instead of Symbol to be more clear ([137db86](https://github.com/jmcdo29/ogma/commit/137db8685e0646660fb8c72fdea0efb7624cb566))

## [0.2.1](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.1) (2020-07-25)

# 0.2.0 (2020-07-20)

### Features

- **logger:** adds hostname to the log output ([a1f2b8d](https://github.com/jmcdo29/ogma/commit/a1f2b8d0e09ab625143c610781849bfd90fdefc4))

# [0.2.0](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.0) (2020-07-20)

### Features

- **logger:** adds hostname to the log output ([a1f2b8d](https://github.com/jmcdo29/ogma/commit/a1f2b8d0e09ab625143c610781849bfd90fdefc4))

## [0.1.1](https://github.com/jmcdo29/ogma/compare/v0.1.0...v0.1.1) (2020-07-18)

### Bug Fixes

- **gql:** updates gql types to work with apollo > 2.11 ([a097842](https://github.com/jmcdo29/ogma/commit/a097842cafdf71a45132c99fe9df2515e41d8c5e))

# [0.1.0](https://github.com/jmcdo29/ogma/compare/v2.0.2...v0.1.0) (2020-04-20)

### Features

- **module:** let base module work for http express ([1bb52a7](https://github.com/jmcdo29/ogma/commit/1bb52a7fa562121f897b03109dfaf8d3b4e5b385))

### Performance Improvements

- **logger:** gets the pid at logger creation instead of at log time ([d8913d0](https://github.com/jmcdo29/ogma/commit/d8913d0905253df2694ca1c542ee96bdf7fcf81a))
