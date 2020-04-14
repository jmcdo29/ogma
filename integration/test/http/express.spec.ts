import { INestApplication } from '@nestjs/common';
import { OgmaInterceptor } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import * as request from 'supertest';
import { createTestModule, getInterceptor } from '../utils';
import { AppModule } from '../../src/http/app.module';

const hello = { hello: 'world' };

describe('Express Server', () => {
  let interceptor: OgmaInterceptor;
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await createTestModule(AppModule, {
      interceptor: { http: ExpressParser },
    });
    app = modRef.createNestApplication();
    const intName = getInterceptor(app);
    interceptor = modRef.get(intName);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('endpoint', () => {
    let logSpy: jest.SpyInstance;
    beforeEach(() => {
      logSpy = jest.spyOn(interceptor, 'log');
    });

    afterEach(() => {
      logSpy.mockClear();
    });

    function expectLogObject(method: string, endpoint: string, status: string) {
      return () => {
        const logObject = logSpy.mock.calls[0][0];
        expect(logObject).toBeALogObject(method, endpoint, 'HTTP/1.1', status);
        expect(logSpy).toHaveBeenCalledTimes(1);
      };
    }

    describe('/', () => {
      it('should work for GET', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(hello)
          .expect(expectLogObject('GET', '/', '200'));
      });
      it('should work fro POST', () => {
        return request(app.getHttpServer())
          .post('/')
          .expect(hello)
          .expect(expectLogObject('POST', '/', '201'));
      });
      it('should work for PATCH', () => {
        return request(app.getHttpServer())
          .patch('/')
          .expect(hello)
          .expect(expectLogObject('PATCH', '/', '200'));
      });
      it('should work for PUT', () => {
        return request(app.getHttpServer())
          .put('/')
          .expect(hello)
          .expect(expectLogObject('PUT', '/', '200'));
      });
      it('should work for DELETE', () => {
        return request(app.getHttpServer())
          .delete('/')
          .expect(hello)
          .expect(expectLogObject('DELETE', '/', '200'));
      });
    });
    describe('status', () => {
      it('should return a 202 instead of 200', () => {
        return request(app.getHttpServer())
          .get('/status')
          .expect(hello)
          .expect(expectLogObject('GET', '/status', '202'));
      });
    });
    describe('error', () => {
      it('should log an error instead of success', () => {
        return request(app.getHttpServer())
          .get('/error')
          .expect(expectLogObject('GET', '/error', '400'));
      });
    });
    describe('skip', () => {
      it('should still return but log nothing', () => {
        return request(app.getHttpServer())
          .get('/skip')
          .expect(hello)
          .expect(() => {
            expect(logSpy).toHaveBeenCalledTimes(0);
          });
      });
    });
  });
});
