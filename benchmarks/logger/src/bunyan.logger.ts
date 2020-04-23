import { createLogger as BunyanLogger } from 'bunyan';
import { WriteStream } from 'fs';

export function createBunyanLogger(stream: WriteStream) {
  return BunyanLogger({
    name: 'Bunyan Bench',
    stream,
    level: 'info',
  });
}
