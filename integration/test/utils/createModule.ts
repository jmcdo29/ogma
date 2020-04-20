import { OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';
import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export async function createTestModule(
  AppModule: Type<any>,
  options: OgmaModuleOptions,
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [AppModule, OgmaModule.forRoot(options)],
  }).compile();
}
