import { createMock } from '@golevelup/ts-jest';
import { FactoryProvider, Provider } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Ogma } from '@ogma/logger';
import { OgmaInterceptor } from './interceptor/ogma.interceptor';
import {
  DelegatorService,
  NoopInterceptorService,
} from './interceptor/providers';
import {
  OGMA_INSTANCE,
  OGMA_SERVICE_TOKEN,
  OgmaInterceptorProviderError,
} from './ogma.constants';
import {
  createLoggerProviders,
  createOgmaInterceptorFactory,
  createOgmaInterceptorOptionsFactory,
  createOgmaProvider,
  createOgmaServiceOptions,
  interceptorProviderFactory,
} from './ogma.provider';
import { OgmaService } from './ogma.service';

const noOptions = 'use noop service as back up';
const withOptions = 'use passed option for interceptor service';

describe('createOgmaProvider', () => {
  it('should create the Ogma class without options', () => {
    const ogma = createOgmaProvider();
    expect(ogma instanceof Ogma).toBeTruthy();
  });
  it('should create the Ogma class with the application option', () => {
    const ogma = createOgmaProvider({ application: 'Test' });
    expect(ogma instanceof Ogma).toBeTruthy();
    expect((ogma as any).options.application).toBe('Test');
  });
});
describe('createOgmaInterceptorOptionsFactory', () => {
  it('should return false', () => {
    expect(
      createOgmaInterceptorOptionsFactory({ interceptor: false }),
    ).toBeFalsy();
  });
  it('should return the merged options', () => {
    expect(
      createOgmaInterceptorOptionsFactory({
        interceptor: {
          http: NoopInterceptorService,
        },
      }),
    ).toEqual({
      http: NoopInterceptorService,
      ws: false,
      gql: false,
      rpc: false,
    });
  });
  it('should throw an error for no good options', () => {
    expect(() =>
      createOgmaInterceptorOptionsFactory({
        interceptor: {},
      }),
    ).toThrowError(OgmaInterceptorProviderError);
  });
});
describe('createOgmaServiceOptions', () => {
  it('should return the service options', () => {
    expect(createOgmaServiceOptions({ interceptor: {} })).toEqual(undefined);
  });
  it('should return actual options and not just undefined', () => {
    expect(
      createOgmaServiceOptions({
        interceptor: {},
        service: {
          json: false,
          color: true,
          application: 'something',
        },
      }),
    ).toEqual({
      color: true,
      json: false,
      application: 'something',
    });
  });
});
describe('creteOgmaInterceptorFactory', () => {
  it('should return a NoopInterceptor', () => {
    expect(
      createOgmaInterceptorFactory(
        false,
        createMock<OgmaService>(),
        createMock<DelegatorService>(),
        createMock<Reflector>(),
      ) instanceof OgmaInterceptor,
    ).toBe(false);
  });
  it('should return the OgmaInterceptor', () => {
    expect(
      createOgmaInterceptorFactory(
        { http: NoopInterceptorService },
        createMock<OgmaService>({
          ogma: { options: { json: false, color: false } },
        } as any),
        createMock<DelegatorService>(),
        createMock<Reflector>(),
      ) instanceof OgmaInterceptor,
    ).toBe(true);
  });
});
describe('createLoggerProviders', () => {
  it('should create a provider with a function for token', () => {
    const factory = expect.any(Function);
    expect(createLoggerProviders(OgmaService)).toMatchObject([
      {
        inject: [OGMA_INSTANCE],
        provide: OGMA_SERVICE_TOKEN + ':OgmaService',
        useFactory: factory,
      },
    ]);
  });
  it('should create a provider with a string for token', () => {
    const factory = expect.any(Function);
    const providers: Provider<
      FactoryProvider<OgmaService>
    >[] = createLoggerProviders('TestService');
    expect(providers).toMatchObject([
      {
        inject: [OGMA_INSTANCE],
        provide: OGMA_SERVICE_TOKEN + ':TestService',
        useFactory: factory,
      },
    ]);
    const prov = providers[0];
    expect((prov as any).useFactory(new Ogma()) instanceof OgmaService).toBe(
      true,
    );
  });
});
describe('interceptorProviderFactory', () => {
  describe('http option', () => {
    it(noOptions, () => {
      expect(
        interceptorProviderFactory('http', NoopInterceptorService)(
          { http: false },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
    it(withOptions, () => {
      expect(
        interceptorProviderFactory('http', NoopInterceptorService)(
          { http: NoopInterceptorService },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
  });
  describe('ws option', () => {
    it(noOptions, () => {
      expect(
        interceptorProviderFactory('ws', NoopInterceptorService)(
          { ws: false },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
    it(withOptions, () => {
      expect(
        interceptorProviderFactory('ws', NoopInterceptorService)(
          { ws: NoopInterceptorService },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
  });
  describe('gql option', () => {
    it(noOptions, () => {
      expect(
        interceptorProviderFactory('gql', NoopInterceptorService)(
          { gql: false },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
    it(withOptions, () => {
      expect(
        interceptorProviderFactory('gql', NoopInterceptorService)(
          { gql: NoopInterceptorService },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
  });
  describe('rpc option', () => {
    it(noOptions, () => {
      expect(
        interceptorProviderFactory('rpc', NoopInterceptorService)(
          { rpc: false },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
    it(withOptions, () => {
      expect(
        interceptorProviderFactory('rpc', NoopInterceptorService)(
          { rpc: NoopInterceptorService },
          new Reflector(),
        ) instanceof NoopInterceptorService,
      ).toBe(true);
    });
  });
});
