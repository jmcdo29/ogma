import { Test } from '@nestjs/testing';
import { createProviderToken } from '@ogma/nestjs-module';
import { stubMethod } from 'hanbi';
import { spec } from 'pactum';
import { test } from 'uvu';
import { equal, is } from 'uvu/assert';

import { NestedModule } from '../src/nested-module/app.module';
import { AppService } from '../src/nested-module/app.service';

test('Nested module should still work', async () => {
  const modRef = await Test.createTestingModule({
    imports: [NestedModule],
  }).compile();
  const app = modRef.createNestApplication();
  const ogmaService = modRef.get(createProviderToken(AppService.name));
  await app.listen(0);
  const ogmaSpy = stubMethod(ogmaService, 'log');
  const baseUrl = await app.getUrl();
  await spec().get(baseUrl.replace('[::1]', 'localhost'));
  is(ogmaSpy.callCount, 1);
  equal(ogmaSpy.firstCall.args[0], 'Hello NestedModule');
  await app.close();
});

test.run();
