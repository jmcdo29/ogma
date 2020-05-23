import { INestApplication, INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { KafkaParser } from '@ogma/platform-kafka';
import { KafkaClientModule } from '../src/kafka/client/kafka-client.module';
import { KafkaServerModule } from '../src/kafka/server/kafka-server.module';
import { getInterceptor, hello, httpPromise } from './utils';

describe('kafka test', () => {
  let interceptor: OgmaInterceptor;
  let server: INestMicroservice;
  let client: INestApplication;

  beforeAll(async () => {
    const serverModRef = await Test.createTestingModule({
      imports: [
        KafkaServerModule,
        OgmaModule.forRoot({
          interceptor: {
            rpc: KafkaParser,
          },
        }),
      ],
    }).compile();
    server = serverModRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    });
    interceptor = getInterceptor(server);
    await server.listenAsync();
    const clientModRef = await Test.createTestingModule({
      imports: [KafkaClientModule],
    }).compile();
    client = clientModRef.createNestApplication();
    await client.listen(0);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  describe('server calls', () => {
    let logSpy: jest.SpyInstance;
    let baseUrl: string;

    beforeAll(async () => {
      baseUrl = await client.getUrl();
    });

    beforeEach(() => {
      logSpy = jest.spyOn(interceptor, 'log');
    });

    afterEach(() => {
      logSpy.mockClear();
    });

    it.each`
      url         | status              | endpoint
      ${'/'}      | ${color.green(200)} | ${'say.hello'}
      ${'/error'} | ${color.red(500)}   | ${'say.error'}
    `(
      '$url call',
      async ({
        url,
        status,
        endpoint,
      }: {
        url: string;
        status: string;
        endpoint: string;
      }) => {
        await httpPromise(baseUrl + url);
        expect(logSpy).toBeCalledTimes(1);
        const logObject = logSpy.mock.calls[0][0];
        expect(logObject).toBeALogObject('Kafka', endpoint, 'kafka', status);
      },
    );

    it('should call the skip but not log it', async () => {
      const data = await httpPromise(baseUrl + '/skip');
      expect(logSpy).toHaveBeenCalledTimes(0);
      expect(data).toEqual(hello);
    });
  });
});
