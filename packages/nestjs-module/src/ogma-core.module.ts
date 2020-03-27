import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  CallHandler,
  ExecutionContext,
  Module,
  NestInterceptor,
} from '@nestjs/common';
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
import { createOgmaProvider } from './ogma.provider';
import { WebsocketInterceptorService } from './interceptor/websocket-interceptor.service';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { GqlInterceptorService } from './interceptor/gql-interceptor.service';
import { RpcInterceptorService } from './interceptor/rpc-interceptor.service';

let ogmaInterceptorDefaults: OgmaInterceptorOptions = {
  http: HttpInterceptorService,
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
          console.log(delegate);
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
      useClass: ogmaInterceptorDefaults.http
        ? ogmaInterceptorDefaults.http
        : HttpInterceptorService,
    },
    {
      provide: WebsocketInterceptorService,
      useClass: ogmaInterceptorDefaults.ws
        ? ogmaInterceptorDefaults.ws
        : WebsocketInterceptorService,
    },
    {
      provide: GqlInterceptorService,
      useClass: ogmaInterceptorDefaults.gql
        ? ogmaInterceptorDefaults.gql
        : GqlInterceptorService,
    },
    {
      provide: RpcInterceptorService,
      useClass: ogmaInterceptorDefaults.rpc
        ? ogmaInterceptorDefaults.rpc
        : RpcInterceptorService,
    },
    OgmaService,
    DelegatorService,
  ],
}) {
  static Deferred = OgmaCoreModule.externallyConfigured(OgmaCoreModule, 0);

  static mergeInterceptorDefaults(
    options: OgmaInterceptorOptions | true,
  ): OgmaInterceptorOptions {
    if (typeof options !== 'boolean' && options !== undefined) {
      ogmaInterceptorDefaults = {
        ...ogmaInterceptorDefaults,
        ...options,
      };
    }
    return ogmaInterceptorDefaults;
  }
}
