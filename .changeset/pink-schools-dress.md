---
'@ogma/logger': minor
---

Adds the ability to mask values of an object while logging based on an initial array config

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
