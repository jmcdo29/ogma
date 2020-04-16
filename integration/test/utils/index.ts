import './matcher';
import { createWriteStream } from 'fs';
import { OgmaServiceOptions } from '@ogma/nestjs-module';

const stream = process.env.CI ? createWriteStream('/dev/null') : process.stdout;

export * from './createModule';
export * from './getInterceptor';
export * from './http-promise';
export * from './socket-promise';
export * from './ws-promise';
export const hello = JSON.stringify({ hello: 'world' });
export const serviceOptionsFactory = (app: string): OgmaServiceOptions => {
  return { application: app, stream };
};
