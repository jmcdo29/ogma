import { Test } from '@nestjs/testing';
import { HttpInterceptorService, OgmaModule, OgmaModuleOptions } from '../src';

class NoopInterceptorService extends HttpInterceptorService {
  noop() {
    return 'noop';
  }
  getCallPoint = this.noop;
  getCallerIp = this.noop;
  getMethod = this.noop;
  getProtocol = this.noop;
  setRequestId;
}

const interceptorOptions = {
  interceptor: {
    http: NoopInterceptorService,
  },
};

const noIntOptions = {};

const allOptions = {
  service: {
    color: true,
    application: 'JEST',
    context: 'TESTING',
    json: false,
  },
  interceptor: {
    http: NoopInterceptorService,
    ws: NoopInterceptorService,
    gql: NoopInterceptorService,
    rpc: NoopInterceptorService,
  },
};

describe('OgmaModule', () => {
  describe('should create a module with', () => {
    it.each`
      options
      ${interceptorOptions}
      ${noIntOptions}
      ${undefined}
      ${allOptions}
    `('%options', async ({ options }: { options: OgmaModuleOptions }) => {
      const mod = await Test.createTestingModule({
        imports: [OgmaModule.forRoot(options)],
      }).compile();
      expect(mod).toBeTruthy();
    });
  });
});
