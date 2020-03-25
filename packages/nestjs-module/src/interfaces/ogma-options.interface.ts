import { ExecutionContext } from '@nestjs/common';
import { OgmaOptions } from 'ogma';
import { OgmaRequest, OgmaResponse } from './ogma-types.interface';

export interface OgmaModuleOptions {
  service?: OgmaServiceOptions;
  interceptor?: OgmaInterceptorOptions | boolean;
}
export type OgmaServiceOptions = Partial<OgmaOptions>;
export interface OgmaInterceptorOptions {
  skip?(req: OgmaRequest, res: OgmaResponse): boolean;
  getRequest?(context: ExecutionContext): OgmaRequest;
  getResponse?(context: ExecutionContext): OgmaResponse;
}

export interface OgmaInterceptorServiceOptions extends OgmaInterceptorOptions {
  json: boolean;
  color: boolean;
}
