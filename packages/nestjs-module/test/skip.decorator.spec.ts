import { OgmaSkip } from '../src';
import { OGMA_INTERCEPTOR_SKIP } from '../src/ogma.constants';

describe('OgmaSkip', () => {
  it('should work on an entire class', () => {
    @OgmaSkip()
    class TestClass {}
    expect(Reflect.getMetadata(OGMA_INTERCEPTOR_SKIP, TestClass)).toBe(true);
  });
  it('should work on a class method', () => {
    class TestClass {
      @OgmaSkip()
      shouldSkip(): void {
        console.log('do nothing');
      }
    }
    const testClass = new TestClass();
    expect(Reflect.getMetadata(OGMA_INTERCEPTOR_SKIP, testClass.shouldSkip)).toBe(true);
  });
});
