import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Scope } from '@nestjs/common';
import { Ogma } from '@ogma/logger';
import { DelegatorService } from './interceptor/delegator.service';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { RpcInterceptorService } from './interceptor/rpc-interceptor.service';
import { WebsocketInterceptorService } from './interceptor/websocket-interceptor.service';
import {
  OgmaModuleOptions,
  OgmaServiceOptions,
} from './interfaces/ogma-options.interface';
import {
  OGMA_CONTEXT,
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_SERVICE_OPTIONS,
} from './ogma.constants';
import { createOgmaProvider } from './ogma.provider';
import { OgmaService } from './ogma.service';
import { OgmaCoreModule } from './ogma-core.module';

@Module({
  imports: [OgmaCoreModule.Deferred],
  exports: [
    OgmaCoreModule,
    OGMA_INTERCEPTOR_OPTIONS,
    OGMA_SERVICE_OPTIONS,
    OgmaService,
    DelegatorService,
    HttpInterceptorService,
    WebsocketInterceptorService,
    RpcInterceptorService,
  ],
})
export class OgmaModule {
  static ogmaInstance?: Ogma;

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
  static forFeature(context = '', options?: OgmaServiceOptions): DynamicModule {
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
  }
}
