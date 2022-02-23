import { suite } from 'uvu';
import { instance } from 'uvu/assert';

import { OgmaLogger } from '../src';

class TestClass {}

const OgmaLoggerDecoratorSuite = suite('Ogma Logger Decorators');
OgmaLoggerDecoratorSuite('Should work with a string', () => {
  instance(OgmaLogger('TestContext'), Function);
});
OgmaLoggerDecoratorSuite('Should work with a class', () => {
  instance(OgmaLogger(TestClass), Function);
});
OgmaLoggerDecoratorSuite.run();
