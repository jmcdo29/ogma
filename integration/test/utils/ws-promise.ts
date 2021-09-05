import { Socket } from 'socket.io-client';
import WebSocket from 'ws';

export const createConnection = (
  client: (url: string) => Socket | WebSocket,
  url: string,
): Promise<Socket | WebSocket> =>
  new Promise((resolve, reject) => {
    const socket = client(url);
    if (Object.getOwnPropertyDescriptor(socket, 'io')) {
      resolve(socket);
    }
    socket.on('open', () => {
      resolve(socket);
    });
    socket.on('error', (err) => {
      reject(err);
    });
  });

export const wsPromise = (
  ws: WebSocket | Socket,
  message: string,
  sendMethod: 'send' | 'emit',
): Promise<any> =>
  new Promise((resolve, reject) => {
    ws[sendMethod](message, {}, (data: any) => {
      if (data) {
        resolve(data);
      }
    });
    ws.on('message', (data) => {
      resolve(data.toString());
      return false;
    });
    ws.on('error', (err) => {
      console.error(err);
      reject(err);
    });
    ws.on('exception' as any, (...args) => {
      resolve(args);
    });
    ws.on('unexpected-response', () => {
      reject('Unexpected-response');
    });
  });
export const wsClose = (ws: WebSocket | Socket): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (wsIsWebsocket(ws)) {
      ws.onclose = () => {
        return resolve();
      };
    } else {
      ws.on('disconnect', () => {
        resolve();
      });
    }
    ws.on('error', (err) => reject(err));
    ws.close();
  });

const wsIsWebsocket = (ws: unknown): ws is WebSocket => {
  return ws instanceof WebSocket;
};
