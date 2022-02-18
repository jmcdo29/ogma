import { Scope } from '@nestjs/common/interfaces';
import { REQUEST as CONTEXT, Reflector } from '@nestjs/core';
import { Ogma } from '@ogma/logger';
import { suite } from 'uvu';
import { equal, instance, is, not } from 'uvu/assert';
import { OgmaService } from '../src';
import { NoopInterceptorService } from '../src/interceptor/providers';
import {
  OGMA_INSTANCE,
  OGMA_REQUEST_SCOPED_SERVICE_TOKEN,
  OGMA_SERVICE_TOKEN,
} from '../src/ogma.constants';
import {
  createLoggerProviders,
  createOgmaInterceptorOptionsFactory,
  createOgmaProvider,
  createOgmaServiceOptions,
  createRequestScopedLoggerProviders,
  interceptorProviderFactory,
} from '../src/ogma.provider';

const noOptions = 'use noop service as back up';
const withOptions = 'use passed option for interceptor service';

const CreateOgmaProviderSuite = suite('Create Ogma Provider');
CreateOgmaProviderSuite('it should create the instance without options', () => {
  instance(createOgmaProvider(), Ogma);
});
CreateOgmaProviderSuite('it should create the instance when options are passed', () => {
  const ogma = createOgmaProvider({ application: 'Test' });
  instance(ogma, Ogma);
  is((ogma as any).options.application, 'Test');
});
CreateOgmaProviderSuite.run();

const CreateOgmaInterceptorOptionsFactorySuite = suite('Create Ogma Interceptor Options Factory');
CreateOgmaInterceptorOptionsFactorySuite('it should return false', () => {
  not.ok(createOgmaInterceptorOptionsFactory({ interceptor: false }));
});
CreateOgmaInterceptorOptionsFactorySuite('should return the merged options', () => {
  equal(createOgmaInterceptorOptionsFactory({ interceptor: { http: NoopInterceptorService } }), {
    http: NoopInterceptorService,
    gql: false,
    ws: false,
    rpc: false,
  });
});
CreateOgmaInterceptorOptionsFactorySuite('should not throw even with invalid options', () => {
  not.throws(() => createOgmaInterceptorOptionsFactory({ interceptor: {} }));
});
CreateOgmaInterceptorOptionsFactorySuite.run();

const CreateOgmaServiceOptionsSuite = suite('Create Ogma Service Options');
CreateOgmaServiceOptionsSuite('Should return the service options', () => {
  is(createOgmaServiceOptions({ interceptor: {} }), undefined);
});
CreateOgmaServiceOptionsSuite('Should return actual options and not undefined', () => {
  equal(
    createOgmaServiceOptions({
      interceptor: {},
      service: {
        json: false,
        color: true,
        application: 'something',
      },
    }),
    {
      color: true,
      json: false,
      application: 'something',
    },
  );
});
CreateOgmaServiceOptionsSuite.run();

const CreateLoggerProvidersSuite = suite('Create Logger Providers');
CreateLoggerProvidersSuite('should create a provider with a function for the token', () => {
  const provider = createLoggerProviders(OgmaService)[0];
  instance(provider.useFactory, Function);
  equal(provider.inject, [OGMA_INSTANCE]);
  is(provider.provide, `${OGMA_SERVICE_TOKEN}:OgmaService`);
});
CreateLoggerProvidersSuite('should create a provider with a string  for the token', () => {
  const provider = createLoggerProviders('TestService')[0];
  instance(provider.useFactory, Function);
  equal(provider.inject, [OGMA_INSTANCE]);
  is(provider.provide, `${OGMA_SERVICE_TOKEN}:TestService`);
});
CreateLoggerProvidersSuite.run();

const CreateRequestScopedLoggerProvidersSuite = suite('Create Request Scoped Logger Providers');
CreateRequestScopedLoggerProvidersSuite(
  'should create a provider with a function for the token',
  () => {
    const provider = createRequestScopedLoggerProviders(OgmaService)[0];
    instance(provider.useFactory, Function);
    equal(provider.inject, [OGMA_INSTANCE, CONTEXT]);
    is(provider.provide, `${OGMA_REQUEST_SCOPED_SERVICE_TOKEN}:OgmaService`);
    is(provider.scope, Scope.REQUEST);
  },
);
CreateRequestScopedLoggerProvidersSuite(
  'should create a provider with a string for the token',
  () => {
    const provider = createRequestScopedLoggerProviders('TestService')[0];
    instance(provider.useFactory, Function);
    equal(provider.inject, [OGMA_INSTANCE, CONTEXT]);
    is(provider.provide, `${OGMA_REQUEST_SCOPED_SERVICE_TOKEN}:TestService`);
    is(provider.scope, Scope.REQUEST);
  },
);
CreateRequestScopedLoggerProvidersSuite.run();

const InterceptorProviderFactorySuite = suite('Interceptor Provider Factory');
for (const type of ['http', 'ws', 'gql', 'rpc'] as const) {
  for (const use of [true, false]) {
    InterceptorProviderFactorySuite(`${type}: ${use ? withOptions : noOptions}`, () => {
      instance(
        interceptorProviderFactory(type, NoopInterceptorService)(
          { [type]: use ? NoopInterceptorService : false },
          new Reflector(),
        ),
        NoopInterceptorService,
      );
    });
  }
}
InterceptorProviderFactorySuite.run();
