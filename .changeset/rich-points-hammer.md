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

NestJS v9 Support

## Features

- Use the new `ConfigurableModuleBuilder` from `@nestjs/common@9`
- Support Fastify v4
  - As a side effect, `@ogma/platform-graphql-fastify` can **only** be used with `@nestjs/mercurius` until `apollo-server-fastify` supports v4

## How to Upgrade

Run your preferred pacakge manager's method of ugrading. There's no code chagnes necessary to the ogma imports, but implications of underlying packages that should be taken into consideration
