---
'@ogma/logger': major
---

Major performance boosts

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
