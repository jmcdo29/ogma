import { Inject } from '@nestjs/common';

import {
  OGMA_CONTEXT,
  OGMA_INSTANCE,
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_TRACE_METHOD_OPTION,
} from '../ogma.constants';

export const InjectOgma = () => Inject(OGMA_INSTANCE);
export const InjectOgmaContext = () => Inject(OGMA_CONTEXT);
export const InjectTraceMethod = () => Inject(OGMA_TRACE_METHOD_OPTION);
export const InjectOgmaInterceptorOptions = () => Inject(OGMA_INTERCEPTOR_OPTIONS);
