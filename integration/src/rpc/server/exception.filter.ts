import { Catch, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: HttpException): Observable<any> {
    return throwError(exception.message);
  }
}
