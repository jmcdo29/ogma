import { Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class RpcInterceptorService extends AbstractInterceptorService {}
