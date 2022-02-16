import { getPackageManagerCommand, logger } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

interface UvuOptions {
  rootDir: string;
  pattern: string;
  coverage: string;
  typescript: boolean;
  tsconfigPaths: boolean;
  runtimeArgs?: string[];
}

export default async function uvuExecutor(options: UvuOptions) {
  let success = true;
  const dashRArgs: string[] = [];
  let command = 'uvu';
  if (options.coverage) {
    command = 'c8 ' + command;
  }
  if (options.typescript) {
    dashRArgs.push('ts-node/register');
  }
  if (options.tsconfigPaths) {
    dashRArgs.push('tsconfig-paths/register');
  }
  dashRArgs.push(...(options.runtimeArgs ?? []));
  const args = dashRArgs.reduce((prev, curr) => {
    return (prev += `-r ${curr} `);
  }, '');
  const { stderr, stdout } = await promisify(exec)(
    `${getPackageManagerCommand().exec} ${command} ${args} ${options.rootDir} ${options.pattern}`,
  );
  if (stderr) {
    logger.error(stderr);
    success = false;
  }
  logger.log(stdout);
  return { success };
}
