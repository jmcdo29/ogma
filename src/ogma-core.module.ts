import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Module } from '@nestjs/common';
import { OgmaModuleOptions } from './interfaces/ogma-options.interface';
import { OGMA_OPTIONS } from './ogma.constants';

/**
 * @internal
 */
@Module({
  exports: [OGMA_OPTIONS],
})
export class OgmaCoreModule extends createConfigurableDynamicRootModule<
  OgmaCoreModule,
  OgmaModuleOptions
>(OGMA_OPTIONS) {
  static Deferred = OgmaCoreModule.externallyConfigured(OgmaCoreModule, 0);
}
