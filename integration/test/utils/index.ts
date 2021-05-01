import './matcher';
import { createWriteStream } from 'fs';
import { OgmaServiceOptions } from '@ogma/nestjs-module';

const stream = process.env.CI ? createWriteStream('/dev/null') : process.stdout;
process.stdout.getColorDepth = () => 8;
export * from './createModule';
export * from './getInterceptor';
export * from './gql-promise';
export * from './http-promise';
export * from './ws-promise';
export const hello = JSON.stringify({ hello: 'world' });
export const serviceOptionsFactory = (app: string, json = false): OgmaServiceOptions => {
  return { application: app, stream, json };
};
