import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createProviderToken, OgmaService } from '@ogma/nestjs-module';
import { NestedModule } from '../src/nested-module/app.module';
import { AppService } from '../src/nested-module/app.service';
import { httpPromise } from './utils';

describe('NestedModule', () => {
  let app: INestApplication;
  let ogmaService: OgmaService;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [NestedModule],
    }).compile();
    app = modRef.createNestApplication();
    ogmaService = modRef.get(createProviderToken(AppService.name));
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
    it('should instantiate and call /', async () => {
      const spy = jest.spyOn(ogmaService, 'log');
      await httpPromise(appUrl);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Hello NestedModule');
    });
  });
});
