import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createProviderToken, OgmaService } from '@ogma/nestjs-module';
import { AppController } from '../src/for-feats/app.controller';
import { ForFeatsModule } from '../src/for-feats/app.module';
import { AppService } from '../src/for-feats/app.service';
import { httpPromise } from './utils';

describe('OgmaModule.forFeatures()', () => {
  let ogmaAppService: OgmaService;
  let ogmaAppController: OgmaService;
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [ForFeatsModule],
    }).compile();
    ogmaAppService = modRef.get(createProviderToken(AppService.name));
    ogmaAppController = modRef.get(createProviderToken(AppController.name));
    app = modRef.createNestApplication();
    await app.listen(0);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('call endpoint', () => {
    let appUrl: string;

    beforeAll(async () => {
      appUrl = await app.getUrl();
    });

    it('should log with different loggers for service and controller', async () => {
      const controllerSpy = jest.spyOn(ogmaAppController, 'log');
      const serviceSpy = jest.spyOn(ogmaAppService, 'log');
      expect(controllerSpy).toHaveBeenCalledTimes(0);
      expect(serviceSpy).toHaveBeenCalledTimes(0);
      await httpPromise(appUrl + '/', { method: 'GET' });
      expect(controllerSpy).toHaveBeenCalledTimes(1);
      expect(controllerSpy).toHaveBeenCalledWith('Hello');
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledWith('Hello');
    });
  });
});
