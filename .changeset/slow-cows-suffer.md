---
'@ogma/nestjs-module': major
'@ogma/platform-express': major
'@ogma/platform-fastify': major
'@ogma/platform-graphql': major
'@ogma/platform-graphql-fastify': major
'@ogma/platform-grpc': major
'@ogma/platform-kafka': major
'@ogma/platform-mqtt': major
'@ogma/platform-nats': major
'@ogma/platform-rabbitmq': major
'@ogma/platform-redis': major
'@ogma/platform-socket.io': major
'@ogma/platform-tcp': major
'@ogma/platform-ws': major
---

New parser format and module options

With the new version, there is no longer a need toseparate the service and interceptor options.As such, the options passed to the module are now the same as those passed to `Ogma` directly **plus** a `traceMethod` property for the `@Log()` decorator.

As for the parsers that _were_ originally passed to `interceptor.[type]`, they should now be registered directly as providers so that the discovery service can find them on application start.

## **FOR ANY CUSTOM EXISTING PARSERS**

Add the `@Parser()` decorator to your parser and pass in the context in which it should be called. This should match what `context.getType()` or `host.getType()` returns
