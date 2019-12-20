import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Scope } from '@nestjs/common';
import { Ogma, OgmaOptions } from 'ogma';
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
   *  Creates a new OgmaService based on the given context and possible options
   *
   * @param context string context for the OgmaService to use in logging
   * @param options optional additional options for creating a new Ogma instance
   */
  static forFeature(
    context?: string,
    options?: Partial<OgmaOptions>,
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
            // if new options are passed, create and provide a new instance of Ogma
            if (options) {
              return createOgmaProvider(options);
            }
            // if no options are passed, but no instance has been created before
            // create an instance of Ogma and save it as a static variable
            if (!OgmaModule.ogmaInstance) {
              OgmaModule.ogmaInstance = createOgmaProvider(moduleOptions);
            }
            // return the static ogmaInstance value
            return OgmaModule.ogmaInstance;
          },
          // transient in case new Ogma instance is needed
          scope: Scope.TRANSIENT,
          inject: [OGMA_OPTIONS],
        },
        OgmaService,
      ],
      exports: [OgmaService],
    };
  }
}
