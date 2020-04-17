import { INestApplication, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import {
  AbstractInterceptorService,
  OgmaInterceptor,
  Type,
} from '@ogma/nestjs-module';
import { SocketIOParser } from '@ogma/platform-socket.io';
import * as Io from 'socket.io-client';
import * as WebSocket from 'ws';
import { WsModule } from '../src/ws/ws.module';
import { hello, serviceOptionsFactory, wsPromise } from './utils';

describe.each`
  adapter      | server         | parser            | client                      | protocol
  ${IoAdapter} | ${'socket.io'} | ${SocketIOParser} | ${(url: string) => Io(url)} | ${'http'}
`(
  '$server server',
  ({
    adapter,
    server,
    parser,
    client,
    protocol,
  }: {
    adapter: Type<WebSocketAdapter>;
    server: string;
    parser: Type<AbstractInterceptorService>;
    client: (url: string) => SocketIOClient.Socket | WebSocket;
    protocol: 'http' | 'ws';
  }) => {
    let app: INestApplication;
    let interceptor: OgmaInterceptor;

    beforeAll(async () => {
      const modRef = await Test.createTestingModule({
        imports: [
          WsModule.register({
            service: serviceOptionsFactory(server),
            interceptor: {
              ws: parser,
            },
          }),
        ],
      }).compile();
      app = modRef.createNestApplication();
      app.useWebSocketAdapter(new adapter(app));
      interceptor = app.get(OgmaInterceptor);
      await app.listen(0);
    });

    afterAll(async () => {
      await app.close();
    });

    describe('messages', () => {
      let logSpy: jest.SpyInstance;
      let ws: WebSocket | SocketIOClient.Socket;

      beforeAll(async () => {
        let baseUrl = await app.getUrl();
        baseUrl = baseUrl.replace('http', protocol);
        ws = client(baseUrl);
      });

      afterAll(() => {
        ws.close();
      });

      beforeEach(() => {
        logSpy = jest.spyOn(interceptor, 'log');
      });

      afterEach(() => {
        logSpy.mockClear();
      });

      it.each`
        message      | status
        ${'message'} | ${color.green(200)}
        ${'throw'}   | ${color.red(500)}
      `(
        '$message',
        async ({ message, status }: { message: string; status: string }) => {
          await wsPromise(ws, message);
          expect(logSpy).toHaveBeenCalledTimes(1);
          const logObject = logSpy.mock.calls[0][0];
          expect(logObject).toBeALogObject(server, message, 'WS', status);
        },
      );
      it('should get the data from skip but not log', async () => {
        const data = await wsPromise(ws, 'skip');
        expect(data).toEqual(JSON.parse(hello));
        expect(logSpy).toHaveBeenCalledTimes(0);
      });
    });
  },
);
