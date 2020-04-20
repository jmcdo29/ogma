import { Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class GqlInterceptorService extends AbstractInterceptorService {}
