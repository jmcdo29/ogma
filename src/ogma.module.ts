import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Scope } from '@nestjs/common';
import { Ogma } from 'ogma';
import { OgmaModuleOptions } from './interfaces/ogma-options.interface';
import { OgmaCoreModule } from './ogma-core.module';
import { OGMA_CONTEXT, OGMA_INSTANCE, OGMA_OPTIONS } from './ogma.constants';
import { createOgmaProvider } from './ogma.provider';
import { OgmaService } from './ogma.service';

@Module({})
export class OgmaModule {
  private static ogmaInstance?: Ogma;

  static forRoot(options: OgmaModuleOptions): DynamicModule {
    return OgmaCoreModule.forRoot(OgmaCoreModule, options);
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
  static forFeature(
    context?: string,
    options?: OgmaModuleOptions,
  ): DynamicModule {
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
              return createOgmaProvider({ ...moduleOptions, ...options });
            }
            if (!OgmaModule.ogmaInstance) {
              OgmaModule.ogmaInstance = createOgmaProvider(moduleOptions);
            }
            return OgmaModule.ogmaInstance;
          },
          inject: [OGMA_OPTIONS],
        },
        OgmaService,
      ],
      exports: [OgmaService],
    };
  }
}
