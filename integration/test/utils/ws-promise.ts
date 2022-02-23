import { Socket } from 'socket.io-client';
import WebSocket from 'ws';

export const makeWs = (
  client: (url: string) => Socket | WebSocket,
  url: string,
  sendMethod: 'send' | 'emit',
) => {
  return new Promise<{ send: (message: string) => Promise<string>; close: () => Promise<void> }>(
    (resolve, reject) => {
      const socket = client(url);
      const send = (message: string) => {
        return new Promise<string>((resolve, reject) => {
          socket[sendMethod](message, {}, (data) => {
            if (data) {
              resolve(data);
            }
          });
          socket.on('data', (data) => {
            resolve(data);
          });
          socket.on('message', (data) => {
            resolve(data);
          });
          socket.on('exception', resolve);
          socket.on('error', reject);
        });
      };
      const close = () => {
        return new Promise<void>((resolve) => {
          if (wsIsWebsocket(socket)) {
            socket.terminate();
            socket.onclose = () => resolve();
          } else {
            socket.on('disconnect', () => resolve());
            socket.disconnect();
          }
        });
      };
      socket.on('connect', () => {
        resolve({ send, close });
      });
      socket.on('open', () => {
        resolve({ send, close });
      });
      socket.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    },
  );
};

const wsIsWebsocket = (ws: unknown): ws is WebSocket => {
  return ws instanceof WebSocket;
};
