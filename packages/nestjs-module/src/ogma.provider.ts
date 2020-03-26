import { Ogma, OgmaOptions } from '@ogma/logger';
import { AbstractInterceptorService } from './interceptor/abstract-interceptor.service';
import { GqlInterceptorService } from './interceptor/gql-interceptor.service';
import { HttpInterceptorService } from './interceptor/http-interceptor.service';
import { RpcInterceptorService } from './interceptor/rpc-interceptor.service';
import { WebsocketInterceptorService } from './interceptor/websocket-interceptor.service';
import { Type } from './interfaces';
import { OgmaCoreModule } from './ogma-core.module';
import { OgmaModule } from './ogma.module';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  OgmaModule.ogmaInstance = new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
  return OgmaModule.ogmaInstance;
}

export function wsInterceptorProvider(): Type<AbstractInterceptorService> {
  return OgmaCoreModule.interceptorOptions.ws
    ? OgmaCoreModule.interceptorOptions.ws
    : WebsocketInterceptorService;
}

export function httpInterceptorProvider(): Type<AbstractInterceptorService> {
  return OgmaCoreModule.interceptorOptions.http
    ? OgmaCoreModule.interceptorOptions.http
    : HttpInterceptorService;
}

export function gqlInterceptorProviders(): Type<AbstractInterceptorService> {
  return OgmaCoreModule.interceptorOptions.gql
    ? OgmaCoreModule.interceptorOptions.gql
    : GqlInterceptorService;
}

export function rpcInterceptorProvider(): Type<AbstractInterceptorService> {
  return OgmaCoreModule.interceptorOptions.rpc
    ? OgmaCoreModule.interceptorOptions.rpc
    : RpcInterceptorService;
}
