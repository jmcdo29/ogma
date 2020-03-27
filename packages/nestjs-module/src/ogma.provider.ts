import { Ogma, OgmaOptions } from '@ogma/logger';
import { Provider } from '@nestjs/common';
import { OgmaService } from './ogma.service';
import { OGMA_INSTANCE, OGMA_SERVICE_TOKEN } from './ogma.constants';

/**
 * @internal
 */
export function createOgmaProvider(options?: Partial<OgmaOptions>): Ogma {
  return new Ogma({
    ...options,
    application: options?.application || 'Nest',
  });
}

export function createProviderToken(topic: string): string {
  return OGMA_SERVICE_TOKEN + topic;
}

export function createLoggerProviders(topic: string | Function): Provider[] {
  topic = typeof topic === 'function' ? topic.name : topic;
  const token = createProviderToken(topic);
  return [
    {
      inject: [OGMA_INSTANCE],
      provide: token,
      useFactory: (ogmaInstance: Ogma): OgmaService => {
        return new OgmaService(ogmaInstance, topic as string);
      },
    },
  ];
}
