import { Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class WebsocketInterceptorService extends AbstractInterceptorService {}
