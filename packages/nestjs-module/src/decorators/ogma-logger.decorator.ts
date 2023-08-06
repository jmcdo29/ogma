import { ContextType, Inject } from '@nestjs/common';
import { DecorateAll } from 'decorate-all';
import { isObservable, Observable, tap } from 'rxjs';

import { AbstractInterceptorService } from '../interceptor/providers';
import { Type } from '../interfaces';
import { OGMA_CONTEXT_PARSER } from '../ogma.constants';
import { createProviderToken, createRequestScopedProviderToken } from '../ogma.provider';
import { OgmaService } from '../ogma.service';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));

export const OgmaLoggerRequestScoped = (topic: string | (() => any) | Type<any>) =>
  Inject(createRequestScopedProviderToken(typeof topic === 'function' ? topic.name : topic));

const isPromise = (obj: unknown): obj is Promise<any> => {
  return typeof obj === 'object' && obj !== null && 'then' in obj && typeof obj.then === 'function';
};

const logEnd = (
  { context, method }: { context: string; method: string },
  logger: OgmaService,
  startTime: number,
) => {
  const timing = Date.now() - startTime;
  logger.trace(`End ${method} - ${timing}ms`, { context });
};

export const Log =
  (loggerProperty = 'logger'): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    const impl = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const start = Date.now();
      const method = propertyKey.toString();
      const logger: OgmaService = this[loggerProperty];
      const context = `${target.constructor.name}#${method}`;
      logger.trace(`Start ${method}`, { context });
      let result: Promise<unknown> | Observable<unknown> | unknown;
      try {
        result = (impl as any).apply(this, args);
      } finally {
        if (!(typeof result === 'object' || typeof result === 'function')) {
          logEnd({ context, method }, logger, start);
        }
      }
      if (isPromise(result)) {
        return result.finally(() => {
          logEnd({ context, method }, logger, start);
        });
      } else if (isObservable(result)) {
        /**
         * By using `result.pipe` here we are changing the reference to `result` and as such
         * we need to re-assign the `result` back to itself so that the new pipe will be ran
         * with the original observable
         */
        return result.pipe(
          tap({
            error: () => logEnd({ context, method }, logger, start),
            complete: () => logEnd({ context, method }, logger, start),
          }),
        );
      }
      return result;
    } as any;
    return descriptor;
  };

export const LogAll = (loggerProperty = 'logger'): ClassDecorator =>
  DecorateAll(Log(loggerProperty));

type ParserDecorator = <TFunction extends Type<AbstractInterceptorService>>(
  target: TFunction,
) => void | TFunction;

export const Parser =
  (type: ContextType | 'graphql' | string): ParserDecorator =>
  (target) => {
    Reflect.defineMetadata(OGMA_CONTEXT_PARSER, type, target);
    return target;
  };
