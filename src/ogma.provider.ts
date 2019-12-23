import { Ogma, OgmaOptions } from 'ogma';

/**
 * @internal
 */
export function createOgmaProvider(options: Partial<OgmaOptions>): Ogma {
  return new Ogma({
    ...options,
    application: options.application || 'Nest',
  });
}
