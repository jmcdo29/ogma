import { ArgumentsHost, Catch, HttpException, Optional } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { OgmaFilterService } from '@ogma/nestjs-module';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  constructor(@Optional() private readonly service?: OgmaFilterService) {
    super();
  }
  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    this.service?.log(exception, host);
    return throwError(() => exception);
  }
}
