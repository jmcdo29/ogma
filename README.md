<!-- [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_nestjs-ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_nestjs-ogma)
-->

# @ogma

Ogma is a simple, no-nonsense logger developed to make logging simple, and easy to read in development, while also having a powerful JSON form when it comes to production level logs, to make it easier to parse and consume by external services. This monorepo has all of the code for the base logger, the binary to rehydrate the JSON logs, and the [NestJS Module](https://nestjs.com) along with supported plugins for the module's interceptor.

## Packages

| Package | Description |
| --- | --- |
| [@ogma/logger](packages/logger) | The base logger package that has the core implementation. Can be used from anything, does not need to be NestJS. Also contains the ogma binary fro log rehydration |
| [@ogma/nestjs-module](packages/nestjs-module) | The core module package that sets up the `OgmaService` and `OgmaInterceptor` |
| [@ogma/platform-express](packages/platform-express) | A plugin for the OgmaInterceptor to properly handle HTTP requests from [Express](http://expressjs.com) |
| [@ogma/platform-fastify](packages/platform-fastify) | An HTTP plugin to properly log [Fastify](https://www.fastify.io/) requests |
| [@ogma/platform-graphql](packages/platform-graphql) | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Express server |
| [@ogma/platform-graphql-fastify](packages/platform-graphql-fastify) | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Fastify server |
| [@ogma/platform-grpc](packages/platform-grpc) | A microservice plugin to properly log [gRPC](https://docs.nestjs.com/microservices/gRPC) requests |
| [@ogma/platform-kafka](packages/platform-kafka) | A microservice plugin to properly log [Kafka](https://docs.nestjs.com/microservices/kafka) requests |
| [@ogma/platform-mqtt](packages/platform-mqtt) | A microservice plugin to properly log [MQTT](https://docs.nestjs.com/microservices/mqtt) requests |
| [@ogma/platform-nats](packages/platform-nats) | A microservice plugin to properly log [NATS](https://docs.nestjs.com/microservices/nats) requests |
| [@ogma/platform-rabbitmq](packages/platform-rabbitmq) | A microservice plugin to properly log [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq) requests |
| [@ogma/platform-redis](packages/platform-redis) | A microservice plugin to properly log [Redis](https://docs.nestjs.com/microservices/redis) requests |
| [@ogma/platform-socket.io](packages/platform-socket.io) | A Gateway plugin to properly log [Socket.io](https://socket.io) requests |
| [@ogma/platform-tcp](packages/platform-tcp) | A microservice plugin to properly log [TCP](https://docs.nestjs.com/microservices/basics) requests |
| [@ogma/platform-ws](packages/platform-ws) | A Gateway plugin to properly log [WS](https://github.com/websockets/ws) requests |
