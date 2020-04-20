import { Reflector } from '@nestjs/core';

export const OGMA_INSTANCE = 'OGMA_INSTANCE';
export const OGMA_CONTEXT = 'OGMA_CONTEXT';
export const OGMA_OPTIONS = 'OGMA_OPTIONS';
export const MESSAGE_METADATA = 'message';
export const MICROSERVICE_METADATA = 'microservices:pattern';
export const OGMA_INTERCEPTOR_OPTIONS = 'OGMA_INTERCEPTOR_OPTIONS';
export const OGMA_SERVICE_OPTIONS = 'OGMA_SERVICE_OPTIONS';
export const OGMA_INTERCEPTOR_SKIP = 'OGMA_INTERCEPTOR_SKIP';
export const OGMA_SERVICE_TOKEN = 'OGMA_SERVICE';
export const OGMA_INTERCEPTOR_PROVIDERS = [OGMA_INTERCEPTOR_OPTIONS, Reflector];

export const OgmaInterceptorProviderError =
  'To use the OgmaInterceptor in your application, please specify which context the logger should be running ' +
  'and make sure to provide an interceptor provider, either from an @ogma package, like @ogma/platform-express ' +
  'or a custom one that extends AbstractInterceptorService.';
