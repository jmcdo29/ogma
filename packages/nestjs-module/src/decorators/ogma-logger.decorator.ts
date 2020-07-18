import { Inject } from '@nestjs/common';
import { createProviderToken } from '../ogma.provider';
import { Type } from '../interfaces';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));
