import { WriteStream } from 'fs';
import { createLogger as WinstonLogger, transports as WinstonTransports } from 'winston';

export function createWinstonLogger(stream: WriteStream) {
  return WinstonLogger({
    level: 'info',
    transports: [new WinstonTransports.Stream({ stream })],
  });
}
