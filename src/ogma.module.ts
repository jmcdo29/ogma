import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  CallHandler,
  DynamicModule,
  ExecutionContext,
  Module,
  Scope,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Ogma } from 'ogma';
import {
  OgmaInterceptorOptions,
  OgmaModuleOptions,
  OgmaServiceOptions,
} from './interfaces/ogma-options.interface';
import {
  OGMA_CONTEXT,
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
} from './ogma.constants';
import { OgmaInterceptor } from './ogma.interceptor';
import { createOgmaProvider } from './ogma.provider';
import { OgmaService } from './ogma.service';

@Module({})
export class OgmaModule extends createConfigurableDynamicRootModule<
  OgmaModule,
  OgmaModuleOptions
>(OGMA_OPTIONS, {
  providers: [
    OgmaService,
    {
      provide: OGMA_INTERCEPTOR_OPTIONS,
      useFactory: (options: OgmaModuleOptions) => options.interceptor,
      inject: [OGMA_OPTIONS],
    },
    {
      provide: OGMA_SERVICE_OPTIONS,
      useFactory: (options: OgmaModuleOptions) => options.service,
      inject: [OGMA_OPTIONS],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (options: OgmaInterceptorOptions, service: OgmaService) => {
        let interceptor;
        if (typeof options !== 'boolean' && options !== undefined) {
          interceptor = new OgmaInterceptor(options, service);
        } else {
          interceptor = {
            intercept: (context: ExecutionContext, next: CallHandler) =>
              next.handle(),
          };
        }
        return interceptor;
      },
      inject: [OGMA_INTERCEPTOR_OPTIONS, OgmaService],
    },
    {
      provide: OGMA_INSTANCE,
      useFactory: (options: OgmaServiceOptions) => createOgmaProvider(options),
      inject: [OGMA_SERVICE_OPTIONS],
    },
  ],
  exports: [OGMA_INTERCEPTOR_OPTIONS, OGMA_SERVICE_OPTIONS],
}) {
  static ogmaInstance?: Ogma;
  private static Deferred = OgmaModule.externallyConfigured(OgmaModule, 0);

  /**
   *  Creates a new OgmaService based on the given context and possible options.
   * Original options from the `forRoot` or `forRootAsync` options are merged with new options
   *
   * @param context string context for the OgmaService to use in logging
   * @param options optional additional options for creating a new Ogma instance
   */
  static forFeature(
    context: string = '',
    options?: OgmaServiceOptions,
  ): DynamicModule {
    return {
      module: OgmaModule,
      imports: [OgmaModule.Deferred],
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
  }
}
