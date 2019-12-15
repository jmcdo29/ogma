import { DynamicModule, Module, Scope } from '@nestjs/common';
import { OgmaOptions } from 'ogma';
import { OGMA_CONTEXT, OGMA_INSTANCE } from './ogma.constants';
import { createOgmaProvider } from './ogma.provider';
import { OgmaService } from './ogma.service';

@Module({})
export class OgmaModule {
  static forFeature(
    options?: Partial<{ context: string } & OgmaOptions>,
  ): DynamicModule {
    return {
      module: OgmaModule,
      providers: [
        {
          provide: OGMA_CONTEXT,
          useValue: options?.context,
          scope: Scope.TRANSIENT,
        },
        {
          provide: OGMA_INSTANCE,
          useValue: createOgmaProvider({ ...options }),
        },
        OgmaService,
      ],
      exports: [OgmaService],
    };
  }
}
