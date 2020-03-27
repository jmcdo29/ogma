import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OgmaModuleOptions } from './interfaces/ogma-options.interface';
import { createLoggerProviders } from './ogma.provider';
import { OgmaService } from './ogma.service';
import { OgmaCoreModule } from './ogma-core.module';

@Module({
  imports: [OgmaCoreModule.Deferred],
  exports: [OgmaCoreModule, OgmaService],
})
export class OgmaModule {
  static forRoot(options?: OgmaModuleOptions): DynamicModule {
    return OgmaCoreModule.forRoot(OgmaCoreModule, options ?? {});
  }

  static forRootAsync(
    options: AsyncModuleConfig<OgmaModuleOptions>,
  ): DynamicModule {
    return OgmaCoreModule.forRootAsync(OgmaCoreModule, options);
  }

  /**
   *  Creates a new OgmaService based on the given context and possible options.
   * Original options from the `forRoot` or `forRootAsync` options are merged with new options
   *
   * @param context string context for the OgmaService to use in logging
   * @param options optional additional options for creating a new Ogma instance
   */
  /* static forFeature(context = '', options?: OgmaServiceOptions): DynamicModule {
    return {
      module: OgmaModule,
      imports: [OgmaCoreModule.Deferred],
      providers: [
        {
          provide: OGMA_CONTEXT,
          useValue: context,
          scope: Scope.TRANSIENT,
        },
        {
          provide: OGMA_INSTANCE,
          useFactory: (moduleOptions: OgmaModuleOptions) => {
            if (options) {
              const originalInstance = OgmaModule.ogmaInstance;
              const returnInstance = createOgmaProvider({
                ...moduleOptions,
                ...options,
              });
              OgmaModule.ogmaInstance = originalInstance;
              return returnInstance;
            }
            return OgmaModule.ogmaInstance;
          },
          inject: [OGMA_SERVICE_OPTIONS],
        },
        OgmaService,
      ],
      exports: [OgmaService],
    };
  } */
  static forFeature(context: string | Function): DynamicModule {
    const providers: Provider[] = createLoggerProviders(context);

    return {
      imports: [OgmaCoreModule.Deferred],
      module: OgmaModule,
      providers,
      exports: providers,
    };
  }
}
