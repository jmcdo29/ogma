import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { SocketIOParser } from '@ogma/platform-socket.io';
import { WsParser } from '@ogma/platform-ws';
import { Stub, stubMethod } from 'hanbi';
import Io from 'socket.io-client';
import { suite } from 'uvu';
import { is } from 'uvu/assert';
import WebSocket from 'ws';
import { WsModule } from '../src/ws/ws.module';
import { makeWs, reportValues, serviceOptionsFactory, toBeALogObject } from './utils';

for (const { adapter, server, parser, client, protocol, sendMethod, serializer } of [
  {
    adapter: IoAdapter,
    server: 'Socket.io',
    parser: SocketIOParser,
    client: (url: string) => Io(url),
    protocol: 'http',
    sendMethod: 'emit',
    serializer: (message: string) => message,
  },
  {
    adapter: WsAdapter,
    server: 'Websocket',
    parser: WsParser,
    client: (url: string) => new WebSocket(url),
    protocol: 'ws',
    sendMethod: 'send',
    serializer: (message: string) => JSON.stringify({ event: message }),
  },
] as const) {
  const WsSuite = suite<{
    logSpy: Stub<OgmaInterceptor['log']>;
    logs: Parameters<OgmaInterceptor['log']>[];
    app: INestApplication;
    baseUrl: string;
    wsClient: { send: (message: string) => Promise<string>; close: () => Promise<void> };
  }>(`${server} interceptor suite`, {
    logs: [],
    logSpy: undefined,
    app: undefined,
    baseUrl: undefined,
    wsClient: undefined,
  });
  WsSuite.before(async (context) => {
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
    context.app = modRef.createNestApplication();
    context.app.useWebSocketAdapter(new adapter(context.app));
    const interceptor = context.app.get(OgmaInterceptor);
    context.logSpy = stubMethod(interceptor, 'log');
    await context.app.listen(0);
    const baseUrl = await context.app.getUrl();
    context.wsClient = await makeWs(client, baseUrl.replace('http', protocol), sendMethod);
  });
  WsSuite.after.each(({ logSpy, logs }) => {
    logSpy.firstCall && logs.push(logSpy.firstCall.args);
    logSpy.reset();
  });
  WsSuite.after(async ({ wsClient, app, logs }) => {
    const ogma = app.get(OgmaService);
    await wsClient.close();
    await app.close();
    reportValues(ogma, logs);
  });
  for (const { message, status } of [
    {
      message: 'message',
      status: style.green.apply(200),
    },
    {
      message: 'throw',
      status: style.red.apply(500),
    },
  ]) {
    WsSuite(`send ${message}`, async ({ wsClient, logSpy }) => {
      await wsClient.send(serializer(message));
      toBeALogObject(logSpy.firstCall.args[0], server.toLowerCase(), message, 'WS', status);
      const reqId = logSpy.firstCall.args[2];
      is(typeof reqId, 'string');
      is(reqId.length, 16);
    });
  }
  WsSuite('it should send but skip logging', async ({ logSpy, wsClient }) => {
    await wsClient.send(serializer('skip'));
    is(logSpy.callCount, 0);
  });
  WsSuite.run();
}

/* describe.each`
  adapter      | server         | parser            | client                                 | protocol  | sendMethod | serializer                                                 | deserializer
  ${IoAdapter} | ${'Socket.io'} | ${SocketIOParser} | ${(url: string) => Io(url)}            | ${'http'} | ${'emit'}  | ${(message: string) => message}                            | ${(message: string) => JSON.parse(message)}
  ${WsAdapter} | ${'Websocket'} | ${WsParser}       | ${(url: string) => new WebSocket(url)} | ${'ws'}   | ${'send'}  | ${(message: string) => JSON.stringify({ event: message })} | ${(message: string) => message}
`(
  '$server server',
  ({
    adapter,
    server,
    parser,
    client,
    protocol,
    sendMethod,
    serializer,
    deserializer,
  }: {
    adapter: Type<WebSocketAdapter>;
    server: string;
    parser: Type<AbstractInterceptorService>;
    client: (url: string) => Socket | WebSocket;
    protocol: 'http' | 'ws';
    sendMethod: 'send' | 'emit';
    serializer: (message: string) => string;
    deserializer: (message: string) => string | Record<string, unknown>;
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
      let ws: WebSocket | Socket;

      beforeAll(async () => {
        let baseUrl = await app.getUrl();
        baseUrl = baseUrl.replace('http', protocol);
        ws = await createConnection(client, baseUrl);
      });

      afterAll(async () => {
        await wsClose(ws);
      });

      beforeEach(() => {
        logSpy = jest.spyOn(interceptor, 'log');
      });

      afterEach(() => {
        logSpy.mockClear();
      });

      it.each`
        message      | status
        ${'message'} | ${style.green.apply(200)}
        ${'throw'}   | ${style.red.apply(500)}
      `('$message', async ({ message, status }: { message: string; status: string }) => {
        await wsPromise(ws, serializer(message), sendMethod);
        expect(logSpy).toHaveBeenCalledTimes(1);
        const logObject = logSpy.mock.calls[0][0];
        const requestId = logSpy.mock.calls[0][2];

        expect(logObject).toBeALogObject(server.toLowerCase(), message, 'WS', status);
        expect(typeof requestId).toBe('string');
        expect(requestId).toHaveLength(16);
      });
      it('should get the data from skip but not log', async () => {
        const data = await wsPromise(ws, serializer('skip'), sendMethod);
        expect(data).toEqual(deserializer(hello));
        expect(logSpy).toHaveBeenCalledTimes(0);
      });
    });
  },
); */
