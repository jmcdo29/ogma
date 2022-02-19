import { getPackageManagerCommand, logger } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

interface UvuOptions {
  rootDir: string;
  pattern: string;
  coverage: string;
  coverageConfig?: string;
  typescript: boolean;
  tsconfigPaths: boolean;
  runtimeArgs?: string[];
  color: boolean;
  useSwc: boolean;
}

export default async function uvuExecutor(options: UvuOptions) {
  let success = true;
  const dashRArgs: string[] = [];
  let command = 'uvu';
  if (options.coverage) {
    let c8Command = 'c8 ';
    if (options.coverageConfig) {
      c8Command += `-c ${options.coverageConfig} `;
    }
    command = c8Command + command;
  }
  if (options.typescript) {
    if (options.useSwc) {
      dashRArgs.push('@swc/register');
    } else {
      dashRArgs.push('ts-node/register');
      if (options.tsconfigPaths) {
        dashRArgs.push('tsconfig-paths/register');
      }
    }
  }
  dashRArgs.push(...(options.runtimeArgs ?? []));
  let args = dashRArgs.reduce((prev, curr) => {
    return (prev += `-r ${curr} `);
  }, '');
  process.env.FORCE_COLOR = '1';
  if (!options.color) {
    process.env.FORCE_COLOR = '0';
    args += '-c=false ';
  }
  try {
    const fullCommand = `${getPackageManagerCommand().exec} ${command} ${args} ${options.rootDir} ${
      options.pattern
    }`;
    logger.debug(`Running command '${fullCommand}'`);
    const { stderr, stdout } = await promisify(exec)(fullCommand);
    if (stderr) {
      logger.error(stderr);
      success = false;
    }
    logger.log(stdout);
    return { success };
  } catch (err) {
    logger.log(err.stdout);
    logger.error(err.stderr);
    return { success: false };
  }
}
