import { suite } from 'uvu';
import { instance } from 'uvu/assert';
import { InjectOgma, InjectOgmaContext, InjectOgmaInterceptorOptions } from '../src';

const OgmaDecoratorsSuite = suite('Ogma Decorators');
OgmaDecoratorsSuite('should return Inject(Ogma_Instance)', () => {
  instance(InjectOgma(), Function);
});
OgmaDecoratorsSuite('Should return Inject(OGMA_CONTEXT)', () => {
  instance(InjectOgmaContext(), Function);
});
OgmaDecoratorsSuite('Should return Inject(OGMA_INTERCEPTOR_OPTIONS)', () => {
  instance(InjectOgmaInterceptorOptions(), Function);
});

OgmaDecoratorsSuite.run();
