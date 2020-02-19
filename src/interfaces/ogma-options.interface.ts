import { ExecutionContext } from '@nestjs/common';
import { OgmaOptions } from 'ogma';
import { OgmaRequest, OgmaResponse } from './ogma-types.interface';

export interface OgmaModuleOptions {
  service?: OgmaServiceOptions;
  interceptor?: OgmaInterceptorOptions | boolean;
}
export interface OgmaServiceOptions extends Partial<OgmaOptions> {}
export interface OgmaInterceptorOptions {
  format?: 'dev' | 'prod';
  skip?(req: OgmaRequest, res: OgmaResponse): boolean;
  getRequest?(context: ExecutionContext): OgmaRequest;
  getResponse?(context: ExecutionContext): OgmaResponse;
}
