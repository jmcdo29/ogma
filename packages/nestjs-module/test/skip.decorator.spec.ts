import { suite } from 'uvu';
import { not, ok } from 'uvu/assert';
import { OgmaSkip } from '../src';
import { OGMA_INTERCEPTOR_SKIP } from '../src/ogma.constants';

const OgmaSkipSuite = suite('OgmaSkip');
OgmaSkipSuite('It should work on an entire class', () => {
  @OgmaSkip()
  class TestClass {}
  ok(Reflect.getMetadata(OGMA_INTERCEPTOR_SKIP, TestClass));
});
OgmaSkipSuite('It should work on a single method', () => {
  class TestClass {
    @OgmaSkip()
    shouldSkip(): void {
      console.log('do nothing');
    }
  }
  const testClass = new TestClass();
  ok(Reflect.getMetadata(OGMA_INTERCEPTOR_SKIP, testClass.shouldSkip));
  not.ok(Reflect.getMetadata(OGMA_INTERCEPTOR_SKIP, TestClass));
});
OgmaSkipSuite.run();
