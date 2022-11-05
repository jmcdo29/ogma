import {
  OgmaFilterLogger,
  OgmaInterceptor,
  OgmaService,
  OgmaServiceOptions,
} from '@ogma/nestjs-module';

const stream = process.stdout;
process.stdout.getColorDepth = () => 8;
export * from './createModule';
export * from './matcher';
export * from './ws-promise';
export const hello = { hello: 'world' };
export const serviceOptionsFactory = (app: string, json = false): OgmaServiceOptions => {
  return { application: app, stream, json };
};

export const reportValues = (
  ogma: OgmaService,
  logs: Parameters<OgmaInterceptor['log'] | OgmaFilterLogger['doLog']>[],
) => {
  if (process.env.CI) {
    return;
  }
  console.log('\n');
  for (const log of logs) {
    ogma.info(log[0], {
      context: log[1]
        ? `${log[1]?.getClass().name}#${log[1]?.getHandler().name}`
        : 'ExceptionFilter',
      correlationId: log[2] ?? '',
    });
  }
};
