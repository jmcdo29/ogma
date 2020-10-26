# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.2](https://github.com/jmcdo29/ogma/compare/v0.4.1...v0.4.2) (2020-10-26)

### Bug Fixes

- OFF means no logs ([bde8068](https://github.com/jmcdo29/ogma/commit/bde80689453b4339fc2180f5593d00117825b3f0))

### Features

- **logger:** move log level to earlier in the log ([da00caa](https://github.com/jmcdo29/ogma/commit/da00caa0060371725d513e1d2eb1d1be0657b230))

## [0.4.1](https://github.com/jmcdo29/ogma/compare/v0.4.0...v0.4.1) (2020-10-25)

### Bug Fixes

- **service:** fixes logger methods to follow `LoggerService` interface ([f1fd191](https://github.com/jmcdo29/ogma/commit/f1fd191d068182293af8261986ce43b442bb95ca))

# [0.4.0](https://github.com/jmcdo29/ogma/compare/v0.3.1...v0.4.0) (2020-10-25)

### Bug Fixes

- **integration:** fix failing integration test location ([270dd0e](https://github.com/jmcdo29/ogma/commit/270dd0ee245f74e57f33efd3e736c8baa1416018))

### Features

- **all:** allow to add extra metadata to logs ([f83904d](https://github.com/jmcdo29/ogma/commit/f83904d2e2038c9e09cae8f97a923ec12c4365a0)), closes [#215](https://github.com/jmcdo29/ogma/issues/215) [#228](https://github.com/jmcdo29/ogma/issues/228) [#297](https://github.com/jmcdo29/ogma/issues/297)

### BREAKING CHANGES

- **all:** log methods now take an object as the second parameter instead of having 3 extra optional parameters

## [0.3.1](https://github.com/jmcdo29/ogma/compare/v0.3.0...v0.3.1) (2020-09-12)

### Features

- **logger:** logger will not print function names when objects have funcs ([c496d16](https://github.com/jmcdo29/ogma/commit/c496d163d94dca5d15205b1f79648d11f05550ff))
- **module:** adds a `forFeatures` method to the module ([e7f5df1](https://github.com/jmcdo29/ogma/commit/e7f5df1aab4e9f5b49861b08ed4654bc8dae44dc))

# [0.3.0](https://github.com/jmcdo29/ogma/compare/v0.2.2...v0.3.0) (2020-09-05)

### Bug Fixes

- **all:** fix the failing build for fastify ([f166eab](https://github.com/jmcdo29/ogma/commit/f166eab08405dcaec325d68fa770bac00c27ca1a))
- **module:** add requestId check to printMessage ([97bcda7](https://github.com/jmcdo29/ogma/commit/97bcda716d950b32216fa5e1cc939794fb012340))

### Features

- **all:** add request id generation and log ([00fd8c7](https://github.com/jmcdo29/ogma/commit/00fd8c7794f546c6265205a1fabfa128fcfb9a83))
- **module:** remove registration of global interceptor ([fdf5ef7](https://github.com/jmcdo29/ogma/commit/fdf5ef72473efec475e833242a5d26878cb7f563))

## [0.2.2](https://github.com/jmcdo29/ogma/compare/v0.2.1...v0.2.2) (2020-08-10)

### Features

- **logger:** logs Symbol(name) instead of Symbol to be more clear ([137db86](https://github.com/jmcdo29/ogma/commit/137db8685e0646660fb8c72fdea0efb7624cb566))

## [0.2.1](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.1) (2020-07-25)

### Bug Fixes

- **all:** fixes OgmaCoreModule not configured ([c7cd6d7](https://github.com/jmcdo29/ogma/commit/c7cd6d75340e4520153c57e9bd49b4f675292874)), closes [#106](https://github.com/jmcdo29/ogma/issues/106)

### Features

- **module:** adds export for `createProviderToken` ([9b0b43f](https://github.com/jmcdo29/ogma/commit/9b0b43f75030cdf9f071c17493a37f4809c18061))

# 0.2.0 (2020-07-20)

### Features

- **logger:** adds hostname to the log output ([a1f2b8d](https://github.com/jmcdo29/ogma/commit/a1f2b8d0e09ab625143c610781849bfd90fdefc4))

# [0.2.0](https://github.com/jmcdo29/ogma/compare/v0.1.2...v0.2.0) (2020-07-20)

### Features

- **logger:** adds hostname to the log output ([a1f2b8d](https://github.com/jmcdo29/ogma/commit/a1f2b8d0e09ab625143c610781849bfd90fdefc4))

## [0.1.2](https://github.com/jmcdo29/ogma/compare/v0.1.1...v0.1.2) (2020-07-18)

### Bug Fixes

- **module:** updates decorators type to accept a class ([1bc3df7](https://github.com/jmcdo29/ogma/commit/1bc3df76ba5f4d66752cd44ab8c34b72843f3292))

## [0.1.1](https://github.com/jmcdo29/ogma/compare/v0.1.0...v0.1.1) (2020-07-18)

### Bug Fixes

- **gql:** updates gql types to work with apollo > 2.11 ([a097842](https://github.com/jmcdo29/ogma/commit/a097842cafdf71a45132c99fe9df2515e41d8c5e))
- **gql-fastify:** update types for graphql-fastify ([83335e6](https://github.com/jmcdo29/ogma/commit/83335e6d7553f1ec48e10fe6b67106633cae6538))

# 0.1.0 (2020-06-08)

### Features

- **benchmarks:** implements benchmarks ([#41](https://github.com/jmcdo29/ogma/issues/41)) ([9c719ef](https://github.com/jmcdo29/ogma/commit/9c719efea0bbd23a03c9f48d76a57dae946b0a8a))
- **grpc:** implements the grpc parser ([b4fc770](https://github.com/jmcdo29/ogma/commit/b4fc770f990e869026ff7ca758e184efa31f4cb1)), closes [#16](https://github.com/jmcdo29/ogma/issues/16)
- **kafka:** finishes the work on the kafka parser ([f8048c9](https://github.com/jmcdo29/ogma/commit/f8048c9ad72ac991cc337dbc850b9ae19a3a3f06)), closes [#17](https://github.com/jmcdo29/ogma/issues/17)
- **kafka:** implements parser for kafka ([4ce590f](https://github.com/jmcdo29/ogma/commit/4ce590f93202b857f9b4d3834c903d5cc122655c)), closes [#17](https://github.com/jmcdo29/ogma/issues/17)
- **mqtt:** implements the mqtt parser for ogma ([b83b65c](https://github.com/jmcdo29/ogma/commit/b83b65c3de1f9bff78537fb8d14ce2a3222a6587)), closes [#18](https://github.com/jmcdo29/ogma/issues/18)
- **nats:** implements NatsParser and test cases ([#47](https://github.com/jmcdo29/ogma/issues/47)) ([b9136f8](https://github.com/jmcdo29/ogma/commit/b9136f8e8cd1e024e0d3a0052c5c93d0ad58215f)), closes [#19](https://github.com/jmcdo29/ogma/issues/19)
- **redis:** implements the redis parser ([5f0ca06](https://github.com/jmcdo29/ogma/commit/5f0ca064ae13237348c548fc6bb7afccbeced836))
- **rmq:** implements RabbitMQ parser for AMQP requests ([2e44261](https://github.com/jmcdo29/ogma/commit/2e4426140d54d75dc1a68fa72c7bf251484635f3)), closes [#20](https://github.com/jmcdo29/ogma/issues/20)

# [0.1.0](https://github.com/jmcdo29/ogma/compare/v2.0.2...v0.1.0) (2020-04-20)

### Bug Fixes

- **interceptor:** adds case to skip over graphql subscriptions ([1e35310](https://github.com/jmcdo29/ogma/commit/1e35310dcc4f123e6768983779f009340bb9d96e))
- **module:** set interceptor defaults ([0156994](https://github.com/jmcdo29/ogma/commit/0156994f1561dab5a56d293d34e761685a9f332c))
- **service:** update printError to include context by default ([31b7819](https://github.com/jmcdo29/ogma/commit/31b7819faf5782d201f8178027b955d9b7a17e49))
- **tcp:** removes second interceptor binding in integration ([8929d9e](https://github.com/jmcdo29/ogma/commit/8929d9e9495a3e23e5e532055367c1bf004121b2))

### Features

- **express:** implements ExpressInterceptorService for OgmaInterceptor ([bbe6335](https://github.com/jmcdo29/ogma/commit/bbe633560022f21b4775c5dc060a4b015d8873b0))
- **fastify:** implemets FastifyInterceptorService for OgmaInterceptor ([9f49298](https://github.com/jmcdo29/ogma/commit/9f49298f3ab68fcfa6eda2d6abe93eb2ed33294c))
- **gql:** implements gql parser for express ([9290504](https://github.com/jmcdo29/ogma/commit/9290504171b32319c73e1ee84c969ef9947a1172)), closes [#14](https://github.com/jmcdo29/ogma/issues/14)
- **gql-fastify:** implements parser for GraphQL-Fastify ([7ec49bc](https://github.com/jmcdo29/ogma/commit/7ec49bc65540ef4ac59a5ba33ab32ad0bdcc9b7a)), closes [#15](https://github.com/jmcdo29/ogma/issues/15)
- **interceptor:** adds websockets to OgmaInterceptor's logging ability ([9c47252](https://github.com/jmcdo29/ogma/commit/9c472529705b700c3a7ab7ed4f5425fef5b727d3)), closes [#8](https://github.com/jmcdo29/ogma/issues/8)
- **interceptor:** creates set up for http/ws/rpc logging ([bef7442](https://github.com/jmcdo29/ogma/commit/bef7442e27127f194d350228544756fbe13afb73)), closes [#7](https://github.com/jmcdo29/ogma/issues/7) [#8](https://github.com/jmcdo29/ogma/issues/8) [#9](https://github.com/jmcdo29/ogma/issues/9)
- **module:** implements plugin system for interceptor context parser ([d116da3](https://github.com/jmcdo29/ogma/commit/d116da3c0512909e08ddd2a22960a30937bf4bad)), closes [#7](https://github.com/jmcdo29/ogma/issues/7) [#8](https://github.com/jmcdo29/ogma/issues/8) [#9](https://github.com/jmcdo29/ogma/issues/9) [#10](https://github.com/jmcdo29/ogma/issues/10) [#11](https://github.com/jmcdo29/ogma/issues/11)
- **module:** let base module work for http express ([1bb52a7](https://github.com/jmcdo29/ogma/commit/1bb52a7fa562121f897b03109dfaf8d3b4e5b385))
- **socket.io:** implements parser for socket.io ([6da8fdb](https://github.com/jmcdo29/ogma/commit/6da8fdb79a57bb7639f2330df73743b2e63cc95f)), closes [#22](https://github.com/jmcdo29/ogma/issues/22)
- **tcp:** implements first draft of tcp parser ([bf0eb6b](https://github.com/jmcdo29/ogma/commit/bf0eb6b5ce27a30725f04ed341d21d157ad8e46f)), closes [#23](https://github.com/jmcdo29/ogma/issues/23)
- **tcp:** implements tcp parser and tests ([4b1b8fa](https://github.com/jmcdo29/ogma/commit/4b1b8faaf440fca690766434d68e2014465aa58e))
- **ws:** implements parser for websocket ([9de8c96](https://github.com/jmcdo29/ogma/commit/9de8c96ab1b71ca56e73613e2379a6df98187203)), closes [#24](https://github.com/jmcdo29/ogma/issues/24)

### Performance Improvements

- **logger:** gets the pid at logger creation instead of at log time ([d8913d0](https://github.com/jmcdo29/ogma/commit/d8913d0905253df2694ca1c542ee96bdf7fcf81a))

## 2.0.4 (2020-01-11)

### Bug Fixes

- add @types/express and fastify to dependencies ([9fa3436](https://github.com/jmcdo29/ogma/commit/9fa3436584a43933043e57dd923489d27210fbb3))

<a name="2.0.5"></a>

## [2.0.5](https://github.com/jmcdo29/nestjs-ogma/compare/2.0.4...2.0.5) (2020-02-19)

### Improvements

- **deps:** remove dependency on fastify and @types/express ([f5a2c41](https://github.com/jmcdo29/nestjs-ogma/commit/f5a2c41))

<a name="2.0.4"></a>

## [2.0.4](https://github.com/jmcdo29/nestjs-ogma/compare/v2.0.2...v2.0.4) (2020-01-11)

### Bug Fixes

- add [@types](https://github.com/types)/express and fastify to dependencies ([9fa3436](https://github.com/jmcdo29/nestjs-ogma/commit/9fa3436))

<a name="2.0.3"></a>

## [2.0.3](https://github.com/jmcdo29/nestjs-ogma/compare/v2.0.0...2.0.3) (2020-01-02)

### Bug Fixes

- **interceptor:** allows for no data to be returned and not fail ([ab2857e](https://github.com/jmcdo29/nestjs-ogma/commit/ab2857e))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/jmcdo29/nestjs-ogma/compare/v0.0.9...v2.0.0) (2020-01-01)

### Features

- **interceptor:** creates OgmaInterceptor for logging http requests ([155eea6](https://github.com/jmcdo29/nestjs-ogma/commit/155eea6))

### BREAKING CHANGES

- **interceptor:** OgmaModule is now required to be the first parameter in `forRoot` and `forRootAsync`. The `OgmaModuleOptions` interface has now changed to have a service and interceptor key, followed by the respective values.

<a name="0.0.9"></a>

## [0.0.9](https://github.com/jmcdo29/nestjs-ogma/compare/v0.0.8...v0.0.9) (2019-12-23)

<a name="0.0.8"></a>

## [0.0.8](https://github.com/jmcdo29/nestjs-ogma/compare/3afc562...v0.0.8) (2019-12-23)

### Bug Fixes

- **service:** makes ogma instance optional in service ctor ([da14ee8](https://github.com/jmcdo29/nestjs-ogma/commit/da14ee8))

### Features

- **config:** allows for root module configuration ([c610566](https://github.com/jmcdo29/nestjs-ogma/commit/c610566))
- **ogma:** creates Ogma module for NestJS usage ([3afc562](https://github.com/jmcdo29/nestjs-ogma/commit/3afc562))
