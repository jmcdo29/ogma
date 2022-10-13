---
'@ogma/nestjs-module': minor
---

Allow for logging out the response body as well

While _technically_ this is a breaking change in the `getContextSuccessString` method, passing the data object instead of the buffer length, to my knowledge there are no custom parsers out there that make use of this method and all `@ogma/*` parsers have been checked that no changes are necessary for them. If this _does_ end up breaking something for someone, I'm sorry.
