import { Provider } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ogma, OgmaOptions } from '@ogma/logger';
import { OGMA_INSTANCE, OGMA_SERVICE_TOKEN } from './ogma.constants';
import { OgmaService } from './ogma.service';
import { AbstractInterceptorService } from './interceptor/providers/abstract-interceptor.service';
import { OgmaInterceptorOptions, Type } from './interfaces';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  return new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
}

export function createProviderToken(topic: string): string {
  return OGMA_SERVICE_TOKEN + ':' + topic;
}

export function createLoggerProviders(topic: string | Function): Provider[] {
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

export const interceptorProviderFactory = (
  type: 'http' | 'gql' | 'ws' | 'rpc',
  backupClass: Type<AbstractInterceptorService>,
): ((
  opt: OgmaInterceptorOptions,
  reflector: Reflector,
) => Type<AbstractInterceptorService>) => (
  intOpts: OgmaInterceptorOptions,
  reflector: Reflector,
): Type<AbstractInterceptorService> =>
  intOpts[type]
    ? new (intOpts as Type<AbstractInterceptorService>)[type](reflector)
    : new backupClass(reflector);
