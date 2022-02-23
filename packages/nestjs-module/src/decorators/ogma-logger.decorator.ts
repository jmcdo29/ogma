import { Inject } from '@nestjs/common';

import { Type } from '../interfaces';
import { createProviderToken, createRequestScopedProviderToken } from '../ogma.provider';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));

export const OgmaLoggerRequestScoped = (topic: string | (() => any) | Type<any>) =>
  Inject(createRequestScopedProviderToken(typeof topic === 'function' ? topic.name : topic));
