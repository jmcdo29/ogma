import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { DelegatorService } from './interceptor/providers';
import {
  OGMA_INSTANCE,
  OGMA_OPTIONS,
  OGMA_SERVICE_OPTIONS,
  OGMA_TRACE_METHOD_OPTION,
} from './ogma.constants';
import {
  createOgmaProvider,
  createOgmaServiceOptions,
  createOgmaTraceOptions,
} from './ogma.provider';
import { OgmaService } from './ogma.service';
import { ConfigurableModuleClass } from './ogma-core.module-definition';
import { OgmaFilterService } from './ogma-filter.service';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: OGMA_SERVICE_OPTIONS,
      useFactory: createOgmaServiceOptions,
      inject: [OGMA_OPTIONS],
    },
    {
      provide: OGMA_TRACE_METHOD_OPTION,
      useFactory: createOgmaTraceOptions,
      inject: [OGMA_SERVICE_OPTIONS],
    },
    {
      provide: OGMA_INSTANCE,
      useFactory: createOgmaProvider,
      inject: [OGMA_SERVICE_OPTIONS],
    },
    OgmaService,
    DelegatorService,
    OgmaFilterService,
  ],
  exports: [OGMA_INSTANCE, OgmaService, DelegatorService, OgmaFilterService],
})
export class OgmaCoreModule extends ConfigurableModuleClass {}
