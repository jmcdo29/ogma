---
'@ogma/styler': major
---

Styles are now methods instead of getters

## What are the breaking changes

Any SRG style is now defined as a method instead of a getter.

### Before

```ts
import { style } from '@ogma/styler';

console.log(style.blue.apply('Hello'));
```

### After

```ts
import { style } from '@ogma/styler';

console.log(style.blue()apply('Hello'));
```

## Why?

Turns out, getters are slow. By using methods we're [able to improve performance considerable][1]

## How?

How do you fix your code? Just add a `()` to any style in the styler's path.
