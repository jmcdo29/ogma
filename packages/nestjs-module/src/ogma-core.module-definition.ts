import { ConfigurableModuleBuilder } from '@nestjs/common';

import { OgmaModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<OgmaModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createModuleConfig')
    .build();
