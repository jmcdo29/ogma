import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OgmaModuleOptions } from './interfaces';
import { createLoggerProviders } from './ogma.provider';
import { OgmaCoreModule } from './ogma-core.module';

@Module({
  imports: [OgmaCoreModule.Deferred],
  exports: [OgmaCoreModule],
})
export class OgmaModule {
  static forRoot(options: OgmaModuleOptions): DynamicModule {
    return OgmaCoreModule.forRoot(OgmaCoreModule, options);
  }

  static forRootAsync(
    options: AsyncModuleConfig<OgmaModuleOptions>,
  ): DynamicModule {
    return OgmaCoreModule.forRootAsync(OgmaCoreModule, options);
  }

  /**
   *  Creates a new OgmaService based on the given context and possible options.
   * Original options from the `forRoot` or `forRootAsync` options are merged with new options
   *
   * @param context string context for the OgmaService to use in logging
   */
  static forFeature(context: string | Function): DynamicModule {
    const providers: Provider[] = createLoggerProviders(context);
    return {
      imports: [OgmaCoreModule.Deferred],
      module: OgmaModule,
      providers,
      exports: providers,
    };
  }
}
