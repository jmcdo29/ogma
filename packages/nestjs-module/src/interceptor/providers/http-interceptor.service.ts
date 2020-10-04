import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class HttpInterceptorService extends AbstractInterceptorService {
  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
  ): string {
    let status: number;
    const res = this.getResponse(context);
    status = res.statusCode;
    const reflectStatus = this.reflector.get<number>(
      HTTP_CODE_METADATA,
      context.getHandler(),
    );
    status = reflectStatus || status;
    if (error) {
      status = this.determineStatusCodeFromError(error);
    }
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private determineStatusCodeFromError(error: HttpException | Error): number {
    let status: number;
    try {
      status = (error as HttpException).getStatus();
    } catch (err) {
      status = 500;
    }
    return status;
  }

  getResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse();
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
