import { OgmaLogger } from './ogma-logger.decorator';

const func = expect.any(Function);

class TestClass {}

describe('OgmaLogger', () => {
  it('should work with a string', () => {
    expect(OgmaLogger('TestContext')).toEqual(func);
  });
  it('should work with a class', () => {
    expect(OgmaLogger(TestClass)).toEqual(func);
  });
});
