import { OgmaStream } from '@ogma/common';
import { Ogma } from '@ogma/logger';

export function createOgmaWithMasksLogger(stream: OgmaStream) {
  return new Ogma({
    application: 'Ogma Mask Bench',
    stream,
    logLevel: 'INFO',
    masks: ['d', 'hello'],
  });
}
