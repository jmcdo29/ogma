import { Provider, Scope } from '@nestjs/common';
import { REQUEST as CONTEXT, Reflector } from '@nestjs/core';
import { Ogma, OgmaOptions } from '@ogma/logger';
import {
  OGMA_INSTANCE,
  OGMA_REQUEST_SCOPED_SERVICE_TOKEN,
  OGMA_SERVICE_TOKEN,
  OgmaInterceptorProviderError,
} from './ogma.constants';
import { OgmaService } from './ogma.service';
import { AbstractInterceptorService } from './interceptor/providers';
import { OgmaInterceptorOptions, OgmaModuleOptions, OgmaServiceOptions, Type } from './interfaces';
import { RequestContext } from './interfaces/request-context.interface';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  return new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
}

function mergeInterceptorDefaults(options: OgmaInterceptorOptions): OgmaInterceptorOptions {
  const mergedOptions: OgmaInterceptorOptions = {
    ...{ http: false, ws: false, rpc: false, gql: false },
    ...options,
  };
  if (Object.keys(mergedOptions).every((key) => mergedOptions[key] === false)) {
    throw new Error(OgmaInterceptorProviderError);
  }
  return mergedOptions;
}

export function createOgmaInterceptorOptionsFactory(
  options: OgmaModuleOptions,
): OgmaInterceptorOptions | false {
  const intOpts = options?.interceptor;
  if (intOpts === false) {
    return intOpts;
  }
  return mergeInterceptorDefaults(intOpts);
}

export function createOgmaServiceOptions(options: OgmaModuleOptions): OgmaServiceOptions {
  return options.service;
}

export function createProviderToken(topic: string): string {
  return OGMA_SERVICE_TOKEN + ':' + topic;
}

export function createRequestScopedProviderToken(topic: string): string {
  return OGMA_REQUEST_SCOPED_SERVICE_TOKEN + ':' + topic;
}

export function createLoggerProviders(topic: string | (() => any) | Type<any>): Provider[] {
  topic = typeof topic === 'function' ? topic.name : topic;
  const token = createProviderToken(topic);
  return [
    {
      inject: [OGMA_INSTANCE],
      provide: token,
      useFactory: (ogmaInstance: Ogma): OgmaService => {
        return new OgmaService(ogmaInstance, topic as string);
      },
    },
  ];
}

export function createRequestScopedLoggerProviders(
  topic: string | (() => any) | Type<any>,
): Provider[] {
  topic = typeof topic === 'function' ? topic.name : topic;
  const token = createRequestScopedProviderToken(topic);
  return [
    {
      inject: [OGMA_INSTANCE, CONTEXT],
      provide: token,
      scope: Scope.REQUEST,
      useFactory: (ogmaInstance: Ogma, requestContext: RequestContext): OgmaService => {
        return new OgmaService(ogmaInstance, topic as string, requestContext);
      },
    },
  ];
}

export const interceptorProviderFactory = (
  type: 'http' | 'gql' | 'ws' | 'rpc',
  backupClass: Type<AbstractInterceptorService>,
): ((opt: OgmaInterceptorOptions, reflector: Reflector) => Type<AbstractInterceptorService>) => (
  intOpts: OgmaInterceptorOptions,
  reflector: Reflector,
): Type<AbstractInterceptorService> =>
  intOpts[type]
    ? new (intOpts as Type<AbstractInterceptorService>)[type](reflector)
    : new backupClass(reflector);
