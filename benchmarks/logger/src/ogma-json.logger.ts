import { OgmaStream } from '@ogma/common';
import { Ogma } from '@ogma/logger';

export function createOgmaJsonLogger(stream: OgmaStream) {
  return new Ogma({
    application: 'Ogma Bench',
    stream,
    logLevel: 'INFO',
    json: true,
  });
}
