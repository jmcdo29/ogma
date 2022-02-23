'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const devkit_1 = require('@nrwl/devkit');
const child_process_1 = require('child_process');
const util_1 = require('util');
async function uvuExecutor(options) {
  var _a;
  let success = true;
  const dashRArgs = [];
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
  dashRArgs.push(...((_a = options.runtimeArgs) !== null && _a !== void 0 ? _a : []));
  let args = dashRArgs.reduce((prev, curr) => {
    return (prev += `-r ${curr} `);
  }, '');
  process.env.FORCE_COLOR = '1';
  if (!options.color) {
    process.env.FORCE_COLOR = '0';
    args += '-c=false ';
  }
  try {
    const fullCommand = `${(0, devkit_1.getPackageManagerCommand)().exec} ${command} ${args} ${
      options.rootDir
    } ${options.pattern}`;
    devkit_1.logger.debug(`Running command '${fullCommand}'`);
    const { stderr, stdout } = await (0, util_1.promisify)(child_process_1.exec)(fullCommand);
    if (stderr) {
      devkit_1.logger.error(stderr);
      success = false;
    }
    devkit_1.logger.log(stdout);
    return { success };
  } catch (err) {
    devkit_1.logger.log(err.stdout);
    devkit_1.logger.error(err.stderr);
    return { success: false };
  }
}
exports.default = uvuExecutor;
