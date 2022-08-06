import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { OgmaModuleOptions, Type } from './interfaces';
import { OgmaProviderOptions } from './interfaces/ogma-provider-options.interface';
import { createLoggerProviders, createRequestScopedLoggerProviders } from './ogma.provider';
import { OgmaCoreModule } from './ogma-core.module';

/**
 * The NestJS module for the Ogma Logger. Not much to say here
 */
@Module({})
export class OgmaModule {
  /**
   * Synchronous registration of the OgmaModule for NestJS. The options you can pass
   * are optional, and if nothing is passed the default value is `{}`
   * @param options The options for the OgmaModule
   * @returns a configured dynamic module for Nest to worry about later
   */
  static forRoot(options?: OgmaModuleOptions): DynamicModule {
    return OgmaCoreModule.forRoot(OgmaCoreModule, options || {});
  }

  /**
   * Asynchronous registration of the OgmaModule for NestJS.
   * @param options Asynchronous NestJS Module options for the OgmaModule
   * @returns a configured dynamic module for Nest to worry about later
   * @see https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370
   */
  static forRootAsync(options: AsyncModuleConfig<OgmaModuleOptions>): DynamicModule {
    return OgmaCoreModule.forRootAsync(OgmaCoreModule, options);
  }

  /**
   * Creates a new OgmaService based on the given context and possible options.
   * Original options from the `forRoot` or `forRootAsync` options are merged with new options
   *
   * @param context string context for the OgmaService to use in logging
   * @param options object options in creation of OgmaService
   * @param options.addRequestId boolean if logger should add requestId to each log
   */
  static forFeature(
    context: string | (() => any) | Type<any>,
    options: OgmaProviderOptions = { addRequestId: false },
  ): DynamicModule {
    const providers: Provider[] = this.createProviders(context, options);
    return {
      module: OgmaModule,
      providers,
      exports: providers,
    };
  }

  /**
   * Creates several new OgmaServices based on the given contexts and possible options.
   * Original options from the `forRoot` or `forRootAsync` options are merged with new options
   */
  static forFeatures(
    contexts: Array<
      | {
          context: string | (() => any) | Type<any>;
          options: OgmaProviderOptions;
        }
      | string
      | (() => any)
      | Type<any>
    >,
  ): DynamicModule {
    const providers: Provider[] = contexts.map((ctx) => {
      if (typeof ctx === 'object') {
        return this.createProviders(ctx.context, ctx.options)[0];
      }
      return this.createProviders(ctx)[0];
    });
    return {
      module: OgmaModule,
      providers,
      exports: providers,
    };
  }

  private static createProviders(
    context: string | (() => any) | Type<any>,
    options: OgmaProviderOptions = { addRequestId: false },
  ): Provider[] {
    if (options.addRequestId) {
      return createRequestScopedLoggerProviders(context);
    }

    return createLoggerProviders(context);
  }
}
