import { WriteStream } from 'fs';

import * as PinoLogger from 'pino';

export function createPinoLogger(stream: WriteStream) {
  return PinoLogger(
    {
      level: 'info',
      name: 'Pino Bench',
    },
    stream,
  );
}
