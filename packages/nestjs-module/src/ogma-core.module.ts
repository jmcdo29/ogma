import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { CallHandler, ExecutionContext, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { DelegatorService } from './interceptor/delegator.service';
import { OgmaInterceptor } from './interceptor/ogma.interceptor';
import {
  OgmaInterceptorOptions,
  OgmaModuleOptions,
  OgmaServiceOptions,
} from './interfaces';
import {
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_INSTANCE,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
} from './ogma.constants';
import { OgmaService } from './ogma.service';
import {
  createOgmaProvider,
  wsInterceptorProvider,
  httpInterceptorProvider,
  gqlInterceptorProviders,
  rpcInterceptorProvider,
} from './ogma.provider';
import { WebsocketInterceptorService } from './interceptor/websocket-interceptor.service';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { GqlInterceptorService } from './interceptor/gql-interceptor.service';
import { RpcInterceptorService } from './interceptor/rpc-interceptor.service';

@Module({})
export class OgmaCoreModule extends createConfigurableDynamicRootModule<
  OgmaCoreModule,
  OgmaModuleOptions
>(OGMA_OPTIONS, {
  providers: [
    {
      provide: OGMA_INTERCEPTOR_OPTIONS,
      useFactory: (
        options: OgmaModuleOptions,
      ): OgmaInterceptorOptions | boolean => {
        const intOpts = options.interceptor;
        if (intOpts !== undefined) {
          if (intOpts === false) {
            return intOpts;
          }
          return OgmaCoreModule.mergeInterceptorDefaults(intOpts);
        } else {
          return true;
        }
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
        let interceptor;
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
      provide: WebsocketInterceptorService,
      useClass: wsInterceptorProvider(),
    },
    {
      provide: HttpInterceptorService,
      useClass: httpInterceptorProvider(),
    },
    {
      provide: GqlInterceptorService,
      useClass: gqlInterceptorProviders(),
    },
    {
      provide: RpcInterceptorService,
      useClass: rpcInterceptorProvider(),
    },
  ],
}) {
  static interceptorOptions: OgmaInterceptorOptions = {
    http: HttpInterceptorService,
    ws: false as const,
    rpc: false as const,
    gql: false as const,
  };
  static Deferred = OgmaCoreModule.externallyConfigured(OgmaCoreModule, 0);

  static mergeInterceptorDefaults(
    options: OgmaInterceptorOptions | true,
  ): OgmaInterceptorOptions {
    if (typeof options !== 'boolean') {
      OgmaCoreModule.interceptorOptions = {
        ...OgmaCoreModule.interceptorOptions,
        ...options,
      };
    }
    return OgmaCoreModule.interceptorOptions;
  }
}
