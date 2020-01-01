import { Ogma, OgmaOptions } from 'ogma';
import { OgmaModule } from './ogma.module';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  OgmaModule.ogmaInstance = new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
  return OgmaModule.ogmaInstance;
}
