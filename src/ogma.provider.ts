import { Ogma, OgmaOptions } from 'ogma';

export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  return new Ogma(options);
}
