import { Inject } from '@nestjs/common';
import { createProviderToken } from '../ogma.provider';

export const OgmaLogger = (topic: string | (() => any)) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));
