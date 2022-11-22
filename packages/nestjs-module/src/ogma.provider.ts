import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST as CONTEXT } from '@nestjs/core';
import { OgmaWritableLevel } from '@ogma/common';
import { Ogma, OgmaOptions } from '@ogma/logger';

import { OgmaModuleOptions, Type } from './interfaces';
import { RequestContext } from './interfaces/request-context.interface';
import {
  OGMA_INSTANCE,
  OGMA_REQUEST_SCOPED_SERVICE_TOKEN,
  OGMA_SERVICE_TOKEN,
} from './ogma.constants';
import { OgmaService } from './ogma.service';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  return new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
}

export function createOgmaServiceOptions(options: OgmaModuleOptions): OgmaModuleOptions {
  return options.service;
}

export function createOgmaTraceOptions(options: OgmaModuleOptions): Lowercase<OgmaWritableLevel> {
  return options?.traceMethod ?? 'fine';
}

export function createProviderToken(topic: string): string {
  return OGMA_SERVICE_TOKEN + ':' + topic;
}

export function createRequestScopedProviderToken(topic: string): string {
  return OGMA_REQUEST_SCOPED_SERVICE_TOKEN + ':' + topic;
}

export function createLoggerProviders(topic: string | (() => any) | Type<any>): FactoryProvider[] {
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
): FactoryProvider[] {
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
