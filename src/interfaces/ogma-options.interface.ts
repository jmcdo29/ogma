import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { OgmaOptions } from 'ogma';

type OgmaRequest = FastifyRequest | Request;
type OgmaResponse = FastifyReply<ServerResponse> | Response;

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
