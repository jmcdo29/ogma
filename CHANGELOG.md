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
