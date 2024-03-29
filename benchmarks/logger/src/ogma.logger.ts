import { OgmaStream } from '@ogma/common';
import { Ogma } from '@ogma/logger';

export function createOgmaLogger(stream: OgmaStream) {
  return new Ogma({
    application: 'Ogma Bench',
    stream,
    logLevel: 'INFO',
  });
}
