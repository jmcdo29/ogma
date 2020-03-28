# @omga

Ogma is a simple, no-nonsense logger developed to make logging simple, and easy to read in development, while also having a powerful JSON form when it comes to production level logs, to make it easier to parse and consume by external services. This monorepo has all of the code for the base logger, the binary to rehydrate the JSON logs, and the [NestJS Module](https://nestjs.com) along with supported plugins for the module's interceptor.

## Packages

| Package | Description |
| --- | --- |
| [@ogma/logger](packages/logger) | The base logger package that has the core implementation. Can be used from anything, does not need to be NestJS. Also contains the ogma binary fro log rehydration |
| [@ogma/nestjs-module](packges/nestjs-module) | The core module package that sets up the `OgmaService` and `OgmaInterceptor` |
| [@ogma/platform-express](packges/platform-express) | A plugin for the OgmaInterceptor to properly handle HTTP requests from [Express](http://expressjs.com) |
| [@ogma/platform-fastify](packges/platform-fastify) | An HTTP plugin to properly log [Fastify](https://www.fastify.io/) requests |
| [@ogma/platform-graphql](packges/platform-graphql) | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Express server |
| [@ogma/platform-graphql-fastify](packges/platform-graphql-fastify) | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Fastify server |
| [@ogma/platform-grpc](packges/platform-grpc) | A microservice plugin to properly log [gRPC](https://docs.nestjs.com/microservices/gRPC) requests |
| [@ogma/platform-kafka](packges/platform-kafka) | A microservice plugin to properly log [Kafka](https://docs.nestjs.com/microservices/kafka) requests |
| [@ogma/platform-mqtt](packges/platform-mqtt) | A microservice plugin to properly log [MQTT](https://docs.nestjs.com/microservices/mqtt) requests |
| [@ogma/platform-nats](packges/platform-nats) | A microservice plugin to properly log [NATS](https://docs.nestjs.com/microservices/nats) requests |
| [@ogma/platform-rabbitmq](packges/platform-rabbitmq) | A microservice plugin to properly log [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq) requests |
| [@ogma/platform-redis](packges/platform-redis) | A microservice plugin to properly log [Redis](https://docs.nestjs.com/microservices/redis) requests |
| [@ogma/platform-socket.io](packges/platform-socket.io) | A Gateway plugin to properly log [Socket.io](https://socket.io) requests |
| [@ogma/platform-tcp](packges/platform-tcp) | A microservice plugin to properly log [TCP](https://docs.nestjs.com/microservices/basics) requests |
| [@ogma/platform-ws](packges/platform-ws) | A Gateway plugin to properly log [WS](https://github.com/websockets/ws) requests |
