import { Inject } from '@nestjs/common';
import { createProviderToken } from '../ogma.provider';

export const OgmaLogger = (topic: string | Function) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));
