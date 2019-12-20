import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Scope } from '@nestjs/common';
import { LogLevel, Ogma, OgmaOptions } from 'ogma';
import { OgmaModuleOptions } from './interfaces/ogma-options.interface';
import { OgmaCoreModule } from './ogma-core.module';
import { OGMA_CONTEXT, OGMA_INSTANCE, OGMA_OPTIONS } from './ogma.constants';
import { createOgmaProvider } from './ogma.provider';
import { OgmaService } from './ogma.service';

@Module({})
export class OgmaModule {
  static ogmaInstance: Ogma;

  static forRoot(options: OgmaModuleOptions): DynamicModule {
    OgmaModule.ogmaInstance = createOgmaProvider({
      logLevel: options.logLevel as keyof typeof LogLevel,
      color: options.color,
      stream: options.stream,
      json: options.json,
      application: options.application ?? 'Nest',
      context: options.context,
    });
    return OgmaCoreModule.forRoot(OgmaCoreModule, options);
  }

  static forRootAsync(
    options: AsyncModuleConfig<OgmaModuleOptions>,
  ): DynamicModule {
    return OgmaCoreModule.forRootAsync(OgmaCoreModule, options);
  }

  static forFeature(
    context?: string,
    options?: Partial<OgmaOptions>,
  ): DynamicModule {
    return {
      module: OgmaModule,
      imports: [OgmaCoreModule.Deferred],
      providers: [
        {
          provide: OGMA_CONTEXT,
          useValue: context,
          scope: Scope.TRANSIENT,
        },
        {
          provide: OGMA_INSTANCE,
          useFactory: () => {
            if (options) {
              return createOgmaProvider(options);
            }
            return OgmaModule.ogmaInstance;
          },
          scope: Scope.TRANSIENT,
        },
        OgmaService,
      ],
      exports: [OgmaService],
    };
  }
}
