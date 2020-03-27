import { Inject } from '@nestjs/common';
import { createProviderToken } from '../ogma.provider';

export function OgmaLogger(topic: string | Function) {
  return Inject(
    createProviderToken(typeof topic === 'function' ? topic.name : topic),
  );
}
