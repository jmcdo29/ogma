import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';
import { OgmaFilterService, OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { SocketIOParser } from '@ogma/platform-socket.io';
import { WsParser } from '@ogma/platform-ws';
import { style } from '@ogma/styler';
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
    logs: Parameters<OgmaInterceptor['log'] | OgmaFilterService['doLog']>[];
    app: INestApplication;
    baseUrl: string;
    wsClient: { send: (message: string) => Promise<string>; close: () => Promise<void> };
    filterSpy: Stub<OgmaFilterService['doLog']>;
  }>(`${server} interceptor suite`, {
    logs: [],
    logSpy: undefined,
    app: undefined,
    baseUrl: undefined,
    wsClient: undefined,
    filterSpy: undefined,
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
    const filterService = context.app.get(OgmaFilterService);
    context.logSpy = stubMethod(interceptor, 'log');
    context.filterSpy = stubMethod(filterService as any, 'doLog');
    context.filterSpy.passThrough();
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
  WsSuite.skip(
    'it should go to the guard and still log the request',
    async ({ wsClient, filterSpy }) => {
      await wsClient.send(serializer('fail-guard'));
      toBeALogObject(
        filterSpy.firstCall.args[0],
        server.toLowerCase(),
        'fail-guard',
        'WS',
        style.red.apply(500),
      );
    },
  );
  WsSuite.run();
}
