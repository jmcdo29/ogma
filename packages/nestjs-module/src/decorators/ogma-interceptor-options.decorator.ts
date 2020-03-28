import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import { OGMA_INTERCEPTOR_OPTIONS } from '../ogma.constants';

export const InjectOgmaInterceptorOptions = makeInjectableDecorator(
  OGMA_INTERCEPTOR_OPTIONS,
);
