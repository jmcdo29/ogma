import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { color, OgmaOptions } from 'ogma';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
} from './interfaces/fastify-like.interface';
import { OgmaInterceptorOptions } from './interfaces/ogma-options.interface';
import { OgmaRequest, OgmaResponse } from './interfaces/ogma-types.interface';
import { OgmaService } from './ogma.service';

@Injectable()
export class OgmaInterceptor implements NestInterceptor {
  private json: boolean;
  private color: boolean;
  constructor(
    private readonly options: OgmaInterceptorOptions,
    private readonly service: OgmaService,
  ) {
    const ogmaOptions: OgmaOptions = (this.service as any).ogma.options;
    this.json = ogmaOptions.json;
    this.color = ogmaOptions.color;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        if (this.shouldLog(context)) {
          this.log(data, context, startTime);
        }
        return;
      }),
      catchError((err) => {
        if (this.shouldLog(context)) {
          this.setStatusCode(
            this.getResponse(context),
            this.determineStatusCodeFromError(err),
          );
          this.log(err, context, startTime);
        }
        return throwError(err);
      }),
    );
  }

  public shouldLog(context: ExecutionContext): boolean {
    const shouldNotLog =
      context.getType() !== 'http' ||
      (this.options.skip &&
        this.options.skip(this.getRequest(context), this.getResponse(context)));
    return !(shouldNotLog !== undefined && shouldNotLog);
  }

  public log(data: any, context: ExecutionContext, startTime: number): void {
    const callingClass = context.getClass().name;
    const callingHandler = context.getHandler().name;
    const req = this.getRequest(context);
    const res = this.getResponse(context);
    data = data ? JSON.stringify(data) : '';
    let logString: string | object = '';
    if (this.options.format === 'dev') {
      logString = this.devContext(req, res, Buffer.from(data), startTime);
    } else {
      logString = this.prodContext(req, res, Buffer.from(data), startTime);
    }
    this.service.info(logString, callingClass + '-' + callingHandler);
  }

  public getRequest(context: ExecutionContext): OgmaRequest {
    if (this.options.getRequest) {
      return this.options.getRequest(context);
    }
    return context.switchToHttp().getRequest();
  }

  public getResponse(context: ExecutionContext): OgmaResponse {
    if (this.options.getResponse) {
      return this.options.getResponse(context);
    }
    return context.switchToHttp().getResponse();
  }

  private devContext(
    req: OgmaRequest,
    res: OgmaResponse,
    data: Buffer,
    startTime: number,
  ): string | object {
    const requestTime = Date.now() - startTime + ' ms';
    const contentLength = data.byteLength;
    const status = this.getStatusCode(res);
    const url = this.getUrl(req);
    const method = this.getMethod(req);
    if (this.json) {
      return {
        method,
        url,
        status,
        'Content-Length': contentLength,
        'Response-Time': requestTime,
      };
    }
    return `${method} ${url} ${this.statusCodeColor(
      status,
    )} ${requestTime} - ${contentLength}`;
  }

  private prodContext(
    req: OgmaRequest,
    res: OgmaResponse,
    data: Buffer,
    startTime: number,
  ): string | object {
    const requestTime = Date.now() - startTime + ' ms';
    const contentLength = data.byteLength;
    const address = req.ips ?? req.ip;
    const status = this.getStatusCode(res);
    const url = this.getUrl(req);
    const method = this.getMethod(req);
    const httpMajor = this.getHttpMajor(req);
    const httpMinor = this.getHttpMinor(req);
    const httpVersion = `${httpMajor}.${httpMinor}`;
    if (this.json) {
      return {
        'Remote-Address': address,
        method,
        url,
        status,
        'Content-Length': contentLength,
        'Response-Time': requestTime,
        httpVersion,
      };
    }
    return `${address} - ${method} ${url} HTTP/${httpVersion} ${this.statusCodeColor(
      status,
    )} ${requestTime} - ${contentLength}`;
  }

  private isFastifyRequest(req: OgmaRequest): req is FastifyLikeRequest {
    return Object.keys(req).indexOf('raw') !== -1;
  }

  private isFastifyResponse(res: OgmaResponse): res is FastifyLikeResponse {
    return Object.keys(res).indexOf('res') !== -1;
  }

  private getStatusCode(res: OgmaResponse): number {
    if (this.isFastifyResponse(res)) {
      return res.res.statusCode;
    }
    return res.statusCode;
  }

  private setStatusCode(res: OgmaResponse, code: number): void {
    if (this.isFastifyResponse(res)) {
      res.res.statusCode = code;
    } else {
      res.statusCode = code;
    }
    return;
  }

  private getUrl(req: OgmaRequest): string | undefined {
    if (this.isFastifyRequest(req)) {
      return req.raw.url;
    }
    return req.url;
  }

  private getMethod(req: OgmaRequest): string | undefined {
    if (this.isFastifyRequest(req)) {
      return req.raw.method;
    }
    return req.method;
  }

  private getHttpMajor(req: OgmaRequest): number {
    if (this.isFastifyRequest(req)) {
      return req.raw.httpVersionMajor;
    }
    return req.httpVersionMajor;
  }

  private getHttpMinor(req: OgmaRequest): number {
    if (this.isFastifyRequest(req)) {
      return req.raw.httpVersionMinor;
    }
    return req.httpVersionMinor;
  }

  private determineStatusCodeFromError(error: HttpException): number {
    return (error.getStatus && error.getStatus()) || 500;
  }

  private statusCodeColor(statusCode: number): string {
    if (this.color) {
      const numericVal = statusCode;
      if (this.isBetween(numericVal, 0, 200)) {
        return statusCode.toString();
      } else if (this.isBetween(numericVal, 200, 300)) {
        return color.green(statusCode);
      } else if (this.isBetween(numericVal, 300, 400)) {
        return color.cyan(statusCode);
      } else if (this.isBetween(numericVal, 400, 500)) {
        return color.yellow(statusCode);
      } else {
        return color.red(statusCode);
      }
    } else {
      return statusCode.toString();
    }
  }

  private isBetween(num: number, min: number, max: number): boolean {
    return num >= min && num < max;
  }
}
