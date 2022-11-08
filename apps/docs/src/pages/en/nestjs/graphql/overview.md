---
id: overview
title: GraphQL Overview
layout: ../../../../layouts/MainLayout.astro
---

Similar to the [HTTP parsers](../http/overview) there are two main GQL parsers as well, one for each underlying HTTP adapter, as GQL in Nest is implemented through the HTTP adapter via a middleware from [`apollo-server`](https://www.apollographql.com/docs/apollo-server/). With graphql, all of the endpoints that are called will be `/graphql`, or whatever endpoint you decide to put your GraphQL server at. This is where the `[Controller#method]` context comes in handy, as it helps separate what query is being executed. Also, as GraphQL doesn't have the notion of HTTP statuses, the status will be inferred based on if it's a success or an error, and what the error type is. Ogma will map this back to HTTP status codes, if the exception is a Nest Exception, otherwise it will map to a 500.

```
[2021-09-06T18:50:23.326Z] [INFO]  [jay-pop] [GraphQL Express] [138646] [1630954223323447] [GqlResolver#getQuery] ::1 - query /graphql HTTP/1.1 200 2ms - 17
```
