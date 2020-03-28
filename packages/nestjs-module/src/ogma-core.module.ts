import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  CallHandler,
  ExecutionContext,
  Module,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { OgmaInterceptor } from './interceptor/ogma.interceptor';
import { DelegatorService } from './interceptor/providers/delegator.service';
import { GqlInterceptorService } from './interceptor/providers/gql-interceptor.service';
import { HttpInterceptorService } from './interceptor/providers/http-interceptor.service';
import { NoopInterceptorService } from './interceptor/providers/noop-interceptor.service';
import { RpcInterceptorService } from './interceptor/providers/rpc-interceptor.service';
import { WebsocketInterceptorService } from './interceptor/providers/websocket-interceptor.service';
import {
  OgmaInterceptorOptions,
  OgmaModuleOptions,
  OgmaServiceOptions,
} from './interfaces';
import {
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_INTERCEPTOR_PROVIDERS,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
  OgmaInterceptorProviderError,
} from './ogma.constants';
import {
  createOgmaProvider,
  interceptorProviderFactory,
} from './ogma.provider';
import { OgmaService } from './ogma.service';

const ogmaInterceptorDefaults: OgmaInterceptorOptions = {
  http: false,
  ws: false,
  rpc: false,
  gql: false,
};

@Module({})
export class OgmaCoreModule extends createConfigurableDynamicRootModule<
  OgmaCoreModule,
  OgmaModuleOptions
>(OGMA_OPTIONS, {
  providers: [
    {
      provide: OGMA_INTERCEPTOR_OPTIONS,
      inject: [OGMA_OPTIONS],
      useFactory: (
        options: OgmaModuleOptions,
      ): OgmaInterceptorOptions | false => {
        const intOpts = options?.interceptor ?? undefined;
        if (intOpts === false) {
          return intOpts;
        }
        return OgmaCoreModule.mergeInterceptorDefaults(intOpts);
      },
    },
    {
      provide: OGMA_SERVICE_OPTIONS,
      useFactory: (options: OgmaModuleOptions) => options.service,
      inject: [OGMA_OPTIONS],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (
        options: OgmaInterceptorOptions | false,
        service: OgmaService,
        delegate: DelegatorService,
        reflector: Reflector,
      ) => {
        let interceptor: NestInterceptor;
        if (options) {
          interceptor = new OgmaInterceptor(
            options,
            service,
            delegate,
            reflector,
          );
        } else {
          interceptor = {
            intercept: (context: ExecutionContext, next: CallHandler) =>
              next.handle(),
          };
        }
        return interceptor;
      },
      inject: [
        OGMA_INTERCEPTOR_OPTIONS,
        OgmaService,
        DelegatorService,
        Reflector,
      ],
    },
    {
      provide: OGMA_INSTANCE,
      useFactory: (options: OgmaServiceOptions) => createOgmaProvider(options),
      inject: [OGMA_SERVICE_OPTIONS],
    },
    {
      provide: HttpInterceptorService,
      useFactory: interceptorProviderFactory('http', NoopInterceptorService),
      inject: OGMA_INTERCEPTOR_PROVIDERS,
    },
    {
      provide: WebsocketInterceptorService,
      useFactory: interceptorProviderFactory('ws', NoopInterceptorService),
      inject: OGMA_INTERCEPTOR_PROVIDERS,
    },
    {
      provide: GqlInterceptorService,
      useFactory: interceptorProviderFactory('gql', NoopInterceptorService),
      inject: OGMA_INTERCEPTOR_PROVIDERS,
    },
    {
      provide: RpcInterceptorService,
      useFactory: interceptorProviderFactory('rpc', NoopInterceptorService),
      inject: OGMA_INTERCEPTOR_PROVIDERS,
    },
    OgmaService,
    DelegatorService,
  ],
  exports: [OGMA_INSTANCE],
}) {
  static Deferred = OgmaCoreModule.externallyConfigured(OgmaCoreModule, 0);

  static mergeInterceptorDefaults(
    options: OgmaInterceptorOptions,
  ): OgmaInterceptorOptions {
    const mergedOptions: OgmaInterceptorOptions = {
      ...ogmaInterceptorDefaults,
      ...options,
    };
    if (
      Object.keys(mergedOptions).every((key) => mergedOptions[key] === false)
    ) {
      throw new Error(OgmaInterceptorProviderError);
    }
    return mergedOptions;
  }
}
