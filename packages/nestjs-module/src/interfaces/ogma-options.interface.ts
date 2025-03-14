import { OgmaWritableLevel } from '@ogma/common';
import { OgmaOptions } from '@ogma/logger';

export type OgmaModuleOptions = Partial<OgmaOptions> & {
  traceMethod?: Lowercase<OgmaWritableLevel>;
  /**
   * determine if extra metadata in the interceptor should be added to the logged line
   */
  inlineMeta?: boolean;
};

export type Type<T> = new (...args: any[]) => T;

export interface OgmaInterceptorServiceOptions {
  json: boolean;
  color: boolean;
  inlineMeta?: boolean;
}
