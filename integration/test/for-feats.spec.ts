import { Test } from '@nestjs/testing';
import { createProviderToken } from '@ogma/nestjs-module';
import { stubMethod } from 'hanbi';
import { spec } from 'pactum';
import { test } from 'uvu';
import { equal, is } from 'uvu/assert';

import { AppController } from '../src/for-feats/app.controller';
import { ForFeatsModule } from '../src/for-feats/app.module';
import { AppService } from '../src/for-feats/app.service';

test('OgmaModule.forFeature should log with two loggers', async () => {
  const modRef = await Test.createTestingModule({
    imports: [ForFeatsModule],
  }).compile();
  const ogmaAppService = modRef.get(createProviderToken(AppService.name));
  const ogmaAppController = modRef.get(createProviderToken(AppController.name));
  const app = modRef.createNestApplication();
  await app.listen(0);
  const controllerLogSpy = stubMethod(ogmaAppController, 'log');
  const serviceLogSpy = stubMethod(ogmaAppService, 'log');
  is(controllerLogSpy.callCount, 0);
  is(serviceLogSpy.callCount, 0);
  await spec().get((await app.getUrl()).replace('[::1]', 'localhost'));

  is(controllerLogSpy.callCount, 1);
  equal(controllerLogSpy.firstCall.args[0], 'Hello');
  is(serviceLogSpy.callCount, 1);
  equal(serviceLogSpy.firstCall.args[0], 'Hello');
  await app.close();
});
test.run();
