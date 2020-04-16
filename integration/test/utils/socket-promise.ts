export const socketPromise = (
  io: SocketIOClient.Socket,
  message: string,
): Promise<any> =>
  new Promise((resolve, reject) => {
    io.emit(message, '', (...data: any[]) => {
      resolve(data);
    });
    io.on('error', (err) => reject(err));
    io.on('exception', (exception) => resolve(exception));
  });
