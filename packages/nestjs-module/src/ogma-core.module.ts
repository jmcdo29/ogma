import { Global, Module } from '@nestjs/common';

import {
  DelegatorService,
  GqlInterceptorService,
  HttpInterceptorService,
  NoopInterceptorService,
  RpcInterceptorService,
  WebsocketInterceptorService,
} from './interceptor/providers';
import {
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_INTERCEPTOR_PROVIDERS,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
  OGMA_TRACE_METHOD_OPTION,
} from './ogma.constants';
import {
  createOgmaInterceptorOptionsFactory,
  createOgmaProvider,
  createOgmaServiceOptions,
  createOgmaTraceOptions,
  interceptorProviderFactory,
} from './ogma.provider';
import { OgmaService } from './ogma.service';
import { ConfigurableModuleClass } from './ogma-core.module-definition';
import { OgmaFilterService } from './ogma-filter.service';

@Global()
@Module({
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
      provide: OGMA_TRACE_METHOD_OPTION,
      useFactory: createOgmaTraceOptions,
      inject: [OGMA_SERVICE_OPTIONS],
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
    OgmaFilterService,
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
    OgmaFilterService,
  ],
})
export class OgmaCoreModule extends ConfigurableModuleClass {}
