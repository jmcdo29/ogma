# @Omga

Ogma is a simple, no-nonsense logger developed to make logging simple, and easy to read in development, while also having a powerful JSON form when it comes to production level logs, to make it easier to parse and consume by external services. This monorepo has all of the code for the base logger, the binary to rehydrate the JSON logs, and the [NestJS Module](https://nestjs.com) along with supported plugins for the module's interceptor. 

## Packages

| Package | Description |
| - | - |
| @ogma/logger | The base logger package that has the core implementation. Can be used from anything, does not need to be NestJS. Also contains the ogma binary fro log rehydration |
| @ogma/nestjs-module | The core module package that sets up the `OgmaService` and `OgmaInterceptor`, with built-in support for [Express](https://expressjs.com) |
| @ogma/platform-fastify | An HTTP plugin to properly log [Fastify](https://www.fastify.io/) requests |
| @ogma/platform-graphql | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Express server |
| @ogma/platform-graphql-fastify | An HTTP/GQL plugin to properly log [GraphQL](https://www.apollographql.com/docs/) requests using the Fastify server |
| @ogma/platform-socket.io | A Gateway plugin to properly log [Socket.io](https://socket.io) requests |
| @ogma/platform-ws | A Gateway plguin to properly log [WS](https://github.com/websockets/ws) requests |
| @ogma/platform-tcp | A microservice plugin to properly log [TCP](https://docs.nestjs.com/microservices/basics) requests |
| @ogma/platform-kafka | A microservice plugin to properly log [Kafka](https://docs.nestjs.com/microservices/kafka) requests |
| @ogma/platform-mqtt | A microservice plugin to properly log [MQTT](https://docs.nestjs.com/microservices/mqtt) requests|
| @ogma/platform-nats | A microservice plugin to properly log [NATS](https://docs.nestjs.com/microservices/nats) requests |
| @ogma/platform-rabbitmq | A microservice plugin to properly log [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq) requests |
| @ogma/platform-grpc | A microservice plugin to properly log [gRC](https://docs.nestjs.com/microservices/gRPC) requests |
| @ogma/platform-redis | A microservice plugin to properly log [Redis](https://docs.nestjs.com/microservices/redis) requests |