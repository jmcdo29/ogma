import { DynamicModule, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';
import { OgmaInterceptor } from '@ogma/nestjs-module';

export async function createTestModule(
  AppModule: Type<any> | DynamicModule,
  options: OgmaModuleOptions,
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [AppModule, OgmaModule.forRoot(options)],
    providers: [
      OgmaInterceptor,
      {
        provide: APP_INTERCEPTOR,
        useExisting: OgmaInterceptor,
      },
    ],
  }).compile();
}
