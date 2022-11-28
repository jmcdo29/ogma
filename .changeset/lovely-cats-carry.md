---
'@ogma/nestjs-module': patch
'@ogma/logger': patch
---

Fix dependencies for better install experience

## `@ogma/logger`

`@ogma/common` and `@ogma/styler` were set as peerDependencies instead of dependencies meaning package managers wouldn't install them by default. They are now properly set as dependencies

## `@ogma/nestjs-module`

`@ogma/logger` was set as a peerDependency instead of a dependency. Now has been set to a dependency.
