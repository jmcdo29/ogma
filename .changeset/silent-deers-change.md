---
'@ogma/cli': minor
---

Allow the CLI to accept process.stdin so it can be piped to.

Now, if you want to have `json: true` always set in your `Ogma` config, but you still want to get the pretty dev logs, you can use something to the extent of `pnpm start:dev | ogma` and ogma will pretty print each line as it comes in.
