import { OgmaOptions } from '@ogma/logger';
import { AbstractInterceptorService } from '../interceptor/abstract-interceptor.service';

export interface OgmaModuleOptions {
  service?: OgmaServiceOptions;
  interceptor?: OgmaInterceptorOptions | boolean;
}
export type OgmaServiceOptions = Partial<OgmaOptions>;

export type Type<T> = new (...args: any[]) => T;
export interface OgmaInterceptorOptions {
  http?: false | Type<AbstractInterceptorService>;
  ws?: false | Type<AbstractInterceptorService>;
  rpc?: false | Type<AbstractInterceptorService>;
  gql?: false | Type<AbstractInterceptorService>;
}

export interface OgmaInterceptorServiceOptions extends OgmaInterceptorOptions {
  json: boolean;
  color: boolean;
}
