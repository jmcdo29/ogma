import { ArgumentsHost, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';

import { OgmaInterceptorServiceOptions } from '../../interfaces';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class HttpInterceptorService extends AbstractInterceptorService {
  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
    _options?: OgmaInterceptorServiceOptions,
  ): string {
    let status: number;
    const res = this.getResponse(context);
    status = res.statusCode;
    if (!error) {
      const reflectStatus = this.reflector.get<number>(HTTP_CODE_METADATA, context.getHandler());
      status = reflectStatus || status;
    } else {
      status = this.determineStatusCodeFromError(error);
    }
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  protected determineStatusCodeFromError(error: HttpException | Error): number {
    let status: number;
    try {
      status = (error as HttpException).getStatus();
    } catch (err) {
      status = 500;
    }
    return status;
  }

  /**
   * A helper method to get the response object
   * @param context execution context from Nest
   * @returns the adapter's response object
   */
  getResponse(context: ArgumentsHost) {
    return context.switchToHttp().getResponse();
  }

  /**
   * A helper method to get the request object
   * @param context execution context from Nest
   * @returns the adapter's request object
   */
  getRequest(context: ArgumentsHost) {
    return context.switchToHttp().getRequest();
  }

  setRequestId(context: ArgumentsHost, requestId: string): void {
    const req = this.getRequest(context) as any;
    req.requestId = requestId;
  }

  getRequestId(context: ArgumentsHost) {
    return this.getRequest(context).requestId;
  }
}
