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

Update package versions to work with Nest v8

# Breaking Changes

For `@ogma/nestjs-module` and all of the `@ogma/platform-*` packages, Nest v8 is the supported package version. Nest v7 may still continue to work, but has no guarantees. Also, RxJS is upgraded to v7 to stay inline with Nest's expectations.

# Why the change was made

To stay current with Nest.

# How to upgrade

Upgrade with Nest v8. There shouldn't be any breaking underlying changes, but you can never be too careful with coded upgrades.
