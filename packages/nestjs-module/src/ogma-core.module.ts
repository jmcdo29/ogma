import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Module } from '@nestjs/common';
import {
  DelegatorService,
  GqlInterceptorService,
  HttpInterceptorService,
  NoopInterceptorService,
  RpcInterceptorService,
  WebsocketInterceptorService,
} from './interceptor/providers';
import { OgmaModuleOptions } from './interfaces';
import {
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_INTERCEPTOR_PROVIDERS,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
} from './ogma.constants';
import {
  createOgmaInterceptorFactory,
  createOgmaInterceptorOptionsFactory,
  createOgmaProvider,
  createOgmaServiceOptions,
  interceptorProviderFactory,
} from './ogma.provider';
import { OgmaService } from './ogma.service';

@Module({})
export class OgmaCoreModule extends createConfigurableDynamicRootModule<
  OgmaCoreModule,
  OgmaModuleOptions
>(OGMA_OPTIONS, {
  providers: [
    {
      provide: OGMA_INTERCEPTOR_OPTIONS,
      inject: [OGMA_OPTIONS],
      useFactory: createOgmaInterceptorOptionsFactory,
    },
    {
      provide: OGMA_SERVICE_OPTIONS,
      useFactory: createOgmaServiceOptions,
      inject: [OGMA_OPTIONS],
    },
    {
      provide: OGMA_INSTANCE,
      useFactory: createOgmaProvider,
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
  exports: [
    OGMA_INSTANCE,
    OGMA_INTERCEPTOR_OPTIONS,
    OgmaService,
    DelegatorService,
    HttpInterceptorService,
    GqlInterceptorService,
    RpcInterceptorService,
    WebsocketInterceptorService,
  ],
}) {
  // static Deferred = OgmaCoreModule.externallyConfigured(OgmaCoreModule, 0);
}
