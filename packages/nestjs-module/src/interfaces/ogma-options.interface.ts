import { OgmaOptions } from '@ogma/logger';
import { OgmaStream } from '../../../common/lib';
import { AbstractInterceptorService } from '../interceptor/providers/abstract-interceptor.service';

export interface OgmaModuleOptions {
  service?: OgmaServiceOptions;
  interceptor: OgmaInterceptorOptions | false;
}
export type OgmaServiceOptions = Partial<
  Omit<Partial<OgmaOptions>, 'stream'> & {
    stream?: Pick<OgmaStream, 'write'> & {
      hasColors?: () => boolean;
      getColorDepth?: () => number;
    };
  }
>;

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
