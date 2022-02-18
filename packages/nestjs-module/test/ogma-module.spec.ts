import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';
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

const allOptions: OgmaModuleOptions = {
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
const OgmaModuleSuite = suite('Ogma Module');
for (const options of [interceptorOptions, noIntOptions, undefined, allOptions]) {
  OgmaModuleSuite(`It should make the module for ${options}`, async () => {
    const mod = await Test.createTestingModule({
      imports: [OgmaModule.forRoot(options)],
    }).compile();
    ok(mod);
  });
}
OgmaModuleSuite.run();
