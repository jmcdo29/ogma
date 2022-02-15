import { test } from 'uvu';
import { ok } from 'uvu/assert';
import { Ogma } from '../src';

test('should have the main export be defined', () => {
  ok(Ogma);
});
test.run();
