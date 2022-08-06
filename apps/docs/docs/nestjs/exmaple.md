---
id: example
title: Configured Example
---

Okay, so now we're ready to add the `OgmaModule` to our Application. Let's assume we have a `CatsService`, `CatsController` and `CatsModule` and a `ConfigService` and `ConfigModule` in our Application. Let's also assume we want to use a class to asynchronously configure out `OgmaModule`. For now, assume the methods exist on the `ConfigService`. Let's also assume we want to log things in color to our `process.stdout`.

```ts
import { FastifyParser } from '@ogma/platform-fastify';
import { OgmaModuleOptions } from '@ogma/nestjs-module';

@Injectable()
export class OgmaModuleConfig
  implements ModuleConfigFactory<OgmaModuleOptions>
{
  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): typeof OgmaModuleOptions {
    return {
      service: {
        // returns one of Ogma's log levels, or 'ALL'.
        logLevel: this.configService.getLogLevel(),
        color: true,
        // could be something like 'MyAwesomeNestApp'
        application: this.configService.getAppName()
      },
      interceptor: {
        http: FastifyParser
      }
    };
  }
}
```

Next, in our `AppModule` we can import the `OgmaModule` like so

```ts
@Module({
  imports: [
    CatsModule,
    ConfigModule,
    OgmaModule.forRootAsync({
      // configuration class we created above
      useClass: OgmaModuleConfig,
      imports: [ConfigModule]
    })
  ]
})
export class AppModule {}
```

And now we have the interceptor bound and an `OgmaService` instance created for the application. If we want to add the `OgmaService` as the general logger for Nest we can do the following in our `main.ts`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const logger = app.get<OgmaService>(OgmaService);
  app.useLogger(logger);
  await app.listen(3000);
}

bootstrap();
```

With this, you will lose the initial logs about instantiation of the modules, but you will still get messages about what routes are bootstrapped and when the server is ready. You can always use `{ bufferLogs: true }` instead if you want to keep the initial logs but in the ogma format.

If we wanted to add the logger to the `CatsService` we can use the module's `forFeature` static method to give the logger service its own context variable.

```ts
@Module({
  imports: [OgmaModule.forFeature(CatsService)],
  controllers: [CatsController],
  service: [CatsService]
})
export class CatsModule {}
```

And now in the `CatsService` the `OgmaService` can be injected like so:

```ts
@Injectable()
export class CatsService {
  constructor(
    @OgmaLogger(CatService) private readonly logger: OgmaService
  ) {}
}
```

And now `this.logger` is available in your `CatsService` class.
