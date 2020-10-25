import { Inject } from '@nestjs/common';
import { createProviderToken, createRequestScopedProviderToken } from '../ogma.provider';
import { Type } from '../interfaces';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));

export const OgmaLoggerRequestScoped = (topic: string | (() => any) | Type<any>) =>
  Inject(createRequestScopedProviderToken(typeof topic === 'function' ? topic.name : topic));
