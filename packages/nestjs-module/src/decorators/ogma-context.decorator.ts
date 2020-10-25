import { Inject } from '@nestjs/common';
import { OGMA_CONTEXT, OGMA_INSTANCE, OGMA_INTERCEPTOR_OPTIONS } from '../ogma.constants';

export const InjectOgma = () => Inject(OGMA_INSTANCE);
export const InjectOgmaContext = () => Inject(OGMA_CONTEXT);
export const InjectOgmaInterceptorOptions = () => Inject(OGMA_INTERCEPTOR_OPTIONS);
