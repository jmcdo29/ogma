import { OgmaWritableLevel } from '@ogma/common';
import { OgmaOptions } from '@ogma/logger';

import { AbstractInterceptorService } from '../interceptor/providers/abstract-interceptor.service';

export interface OgmaModuleOptions {
  /**
   * The options that will be passed to the Ogma instance
   */
  service?: OgmaServiceOptions;
  /**
   * The options that will be passed to the OgmaModule for the interceptor. This is what sets up the parsers
   * so that the interceptor can do the proper parsing of requests
   */
  interceptor?: OgmaInterceptorOptions | false;
}
export type OgmaServiceOptions = Partial<OgmaOptions> & {
  traceMethod?: Lowercase<OgmaWritableLevel>;
};

export type Type<T> = new (...args: any[]) => T;
export interface OgmaInterceptorOptions {
  /**
   * The parser to be used for the HTTP requests
   */
  http?: false | Type<AbstractInterceptorService>;
  /**
   * The parser to be used for the WS requests
   */
  ws?: false | Type<AbstractInterceptorService>;
  /**
   * The parser to be used for the RPC requests.
   * Currently Ogma only supports one RPC adapter, but you could create a custom adapter that can handle multiple RPC clients
   */
  rpc?: false | Type<AbstractInterceptorService>;
  /**
   * The parser to be used for the GraphQL requests
   */
  gql?: false | Type<AbstractInterceptorService>;
}

export interface OgmaInterceptorServiceOptions extends OgmaInterceptorOptions {
  json: boolean;
  color: boolean;
}
