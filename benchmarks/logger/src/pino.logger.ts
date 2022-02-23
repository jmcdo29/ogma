import { WriteStream } from 'fs';
import { pino } from 'pino';
export function createPinoLogger(stream: WriteStream) {
  return pino(
    {
      level: 'info',
      name: 'Pino Bench',
    },
    stream,
  );
}
