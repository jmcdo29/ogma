import * as WebSocket from 'ws';

export const wsPromise = (
  ws: WebSocket | SocketIOClient.Socket,
  message: string,
): Promise<any> =>
  new Promise((resolve, reject) => {
    ws.emit(message, '', (data) => resolve(data));
    ws.on('error', (err) => {
      console.error(err);
      reject(err);
    });
    ws.on('message', (data) => {
      console.log(`Got data ${data}`);
      resolve(data);
    });
    ws.on('ping', () => {
      resolve('ping');
    });
    ws.on('pong', () => {
      resolve('pong');
    });
    ws.on('exception' as any, (...args) => {
      resolve(args);
    });
  });
