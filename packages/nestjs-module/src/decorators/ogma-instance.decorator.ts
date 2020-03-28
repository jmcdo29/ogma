import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import { OGMA_INSTANCE } from '../ogma.constants';

export const InjectOgma = makeInjectableDecorator(OGMA_INSTANCE);
