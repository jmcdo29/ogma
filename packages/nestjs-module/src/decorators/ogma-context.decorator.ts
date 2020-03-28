import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import { OGMA_CONTEXT } from '../ogma.constants';

export const InjectOgmaContext = makeInjectableDecorator(OGMA_CONTEXT);
