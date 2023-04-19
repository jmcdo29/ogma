# @ogma/styler

## 1.0.1

### Patch Changes

- dd5215e: Security updates of dependencies. Should be nothing major here.
- Updated dependencies [dd5215e]
  - @ogma/common@1.1.1

## 1.0.0

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
