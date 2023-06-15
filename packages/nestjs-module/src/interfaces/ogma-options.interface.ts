import { OgmaWritableLevel } from '@ogma/common';
import { OgmaOptions } from '@ogma/logger';

export type OgmaModuleOptions = Partial<OgmaOptions> & {
  traceMethod?: Lowercase<OgmaWritableLevel>;
};

export type Type<T> = new (...args: any[]) => T;

export interface OgmaInterceptorServiceOptions {
  json: boolean;
  color: boolean;
}
