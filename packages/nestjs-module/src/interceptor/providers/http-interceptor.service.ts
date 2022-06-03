import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';

import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class HttpInterceptorService extends AbstractInterceptorService {
  getStatus(context: ExecutionContext, inColor: boolean, error?: HttpException | Error): string {
    let status: number;
    const res = this.getResponse(context);
    status = res.statusCode;
    const reflectStatus = this.reflector.get<number>(HTTP_CODE_METADATA, context.getHandler());
    status = reflectStatus || status;
    if (error) {
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
  getResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse();
  }

  /**
   * A helper method to get the request object
   * @param context execution context from Nest
   * @returns the adapter's request object
   */
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
