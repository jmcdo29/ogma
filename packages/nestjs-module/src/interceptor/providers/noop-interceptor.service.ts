import { Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class NoopInterceptorService extends AbstractInterceptorService {
  getCallerIp(): string[] | string {
    return 'caller ip';
  }

  getCallPoint(): string {
    return 'call point';
  }

  getStatus(): string {
    return 'status';
  }

  getMethod(): string {
    return 'method';
  }

  getProtocol(): string {
    return 'protocol';
  }

  setRequestId(): void {
    return;
  }
}
