import { ContextType, Inject } from '@nestjs/common';
import { isObservable, tap } from 'rxjs';

import { AbstractInterceptorService } from '../interceptor/providers';
import { Type } from '../interfaces';
import { OGMA_CONTEXT_PARSER } from '../ogma.constants';
import { createProviderToken, createRequestScopedProviderToken } from '../ogma.provider';
import { OgmaService } from '../ogma.service';

export const OgmaLogger = (topic: string | (() => any) | Type<any>) =>
  Inject(createProviderToken(typeof topic === 'function' ? topic.name : topic));

export const OgmaLoggerRequestScoped = (topic: string | (() => any) | Type<any>) =>
  Inject(createRequestScopedProviderToken(typeof topic === 'function' ? topic.name : topic));

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
      let result = (impl as any).apply(this, args);
      if (result.then) {
        result.finally(() => {
          logEnd({ context, method }, logger, start);
        });
      } else if (isObservable(result)) {
        /**
         * By using `result.pipe` here we are changing the reference to `result` and as such
         * we need to re-assign the `result` back to itself so that the new pipe will be ran
         * with the original observable
         */
        result = result.pipe(tap({ complete: () => logEnd({ context, method }, logger, start) }));
      } else {
        logEnd({ context, method }, logger, start);
      }
      return result;
    } as any;
    return descriptor;
  };

export const LogAll =
  (loggerProperty = 'logger'): ClassDecorator =>
  (target) => {
    const allKeys = Reflect.ownKeys(target.prototype);
    const keys = allKeys.filter((key) => key !== 'constructor');
    for (const key of keys) {
      const logRet = Log(loggerProperty)(
        target.prototype,
        key,
        Reflect.getOwnPropertyDescriptor(target.prototype, key),
      );
      if (logRet) {
        target.prototype[key] = logRet.value;
      }
    }
    return target;
  };

type ParserDecorator = <TFunction extends Type<AbstractInterceptorService>>(
  target: TFunction,
) => void | TFunction;

export const Parser =
  (type: ContextType | 'graphql' | string): ParserDecorator =>
  (target) => {
    Reflect.defineMetadata(OGMA_CONTEXT_PARSER, type, target);
    return target;
  };
