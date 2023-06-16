import { DynamicModule, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AbstractInterceptorService, OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';
import { OgmaInterceptor } from '@ogma/nestjs-module';

export async function createTestModule(
  AppModule: Type<any> | DynamicModule,
  options: OgmaModuleOptions,
  providers: Type<AbstractInterceptorService>[] = [],
): Promise<TestingModule> {
  const module = Test.createTestingModule({
    imports: [AppModule, OgmaModule.forRoot(options)],
    providers: [
      OgmaInterceptor,
      {
        provide: APP_INTERCEPTOR,
        useExisting: OgmaInterceptor,
      },
      ...providers,
    ],
  });
  if (!process.env.CI) {
    module.setLogger(console);
  }
  return module.compile();
}
