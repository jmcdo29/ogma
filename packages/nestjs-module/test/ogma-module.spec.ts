import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { OgmaModule, OgmaModuleOptions } from '../src';

const noIntOptions = {};

const allOptions: OgmaModuleOptions = {};
const OgmaModuleSuite = suite('Ogma Module');
for (const options of [noIntOptions, undefined, allOptions]) {
  OgmaModuleSuite(`It should make the module for ${options}`, async () => {
    const mod = await Test.createTestingModule({
      imports: [OgmaModule.forRoot(options)],
    }).compile();
    ok(mod);
  });
}
OgmaModuleSuite.run();
