import { Inject } from '@nestjs/common';
import { isObservable, tap } from 'rxjs';

import { Type } from '../interfaces';
import { createProviderToken, createRequestScopedProviderToken } from '../ogma.provider';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));

export const OgmaLoggerRequestScoped = (topic: string | (() => any) | Type<any>) =>
  Inject(createRequestScopedProviderToken(typeof topic === 'function' ? topic.name : topic));

const logStart = (context: string, logger: { log: (...args: unknown[]) => void }) => {
  const start = Date.now();
  logger.log(`Start ${context}`);
  return start;
};
const logEnd = (
  context: string,
  logger: { log: (...args: unknown[]) => void },
  startTime: number,
) => {
  const timing = Date.now() - startTime;
  logger.log(`End ${context} - ${timing}ms`);
};

export const Log =
  (loggerProperty = 'logger'): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    const impl = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const logger = this[loggerProperty];
      const context = `${target.constructor.name}#${propertyKey.toString()}`;
      const start = logStart(context, logger);
      const result = (impl as any).apply(this, ...args);
      if (result.then) {
        result.finally(() => {
          logEnd(context, logger, start);
        });
      } else if (isObservable(result)) {
        result.pipe(tap(() => logEnd(context, logger, start)));
      } else {
        logEnd(context, logger, start);
      }
      return result;
    } as any;
    return descriptor;
  };
