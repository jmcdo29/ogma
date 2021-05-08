import { Command, CommandRunner, Option } from 'nest-commander';
import { Color, OgmaLog } from '@ogma/common';
import { FileService } from './file.service';
import { badFormat } from './messages';
import { OgmaGetterService } from './ogma-getters.service';

@Command({
  name: 'hydrate',
  arguments: '<file>',
  description: 'Hydrate a file from being a JSON Ogma log to a dev friendly format',
  argsDescription: {
    file: 'The file to be parsed from JSON to dev format',
  },
  options: { isDefault: true },
})
export class OgmaCommand implements CommandRunner {
  constructor(
    private readonly fileService: FileService,
    private readonly ogmaGetter: OgmaGetterService,
  ) {}
  private ogmaKeys = ['time', 'pid', 'level'];

  async run(params: string[], options: { color: boolean }): Promise<void> {
    const logs = await this.readFile(params[0]);
    if (!logs.every((log) => this.checkOgmaFormat(log))) {
      throw new Error(badFormat);
    }
    logs.map((log) => JSON.parse(log)).forEach((log: OgmaLog) => this.writeLog(log, options.color));
  }

  @Option({
    flags: '-c, --color [color]',
    description: 'If the output should be in color or not',
    defaultValue: process.stdout.isTTY,
  })
  praseBoolean(val?: string): boolean {
    return val ? JSON.parse(val) : true;
  }

  private async readFile(fileName: string): Promise<string[]> {
    return (await this.fileService.read(fileName)).split('\n').filter((log) => log);
  }

  private checkOgmaFormat(log: string): boolean {
    try {
      return this.isOgmaFormat(JSON.parse(log));
    } catch {
      return false;
    }
  }

  private isOgmaFormat(log: Record<string, any>): log is OgmaLog {
    return this.ogmaKeys.every((key) => Object.prototype.hasOwnProperty.call(log, key));
  }

  private writeLog(log: OgmaLog, color: boolean): void {
    const { time, hostname, application, context, pid, ool, level, ...rest } = log;
    let logMessage = this.ogmaGetter.wrapInParens(time) + ' ';
    logMessage += this.ogmaGetter.getLevel(ool, color) + ' ';
    logMessage += this.ogmaGetter.getVal(hostname, color, Color.MAGENTA) + ' ';
    if (application) {
      logMessage += this.ogmaGetter.getVal(application, color, Color.YELLOW) + ' ';
    }
    logMessage += pid + ' ';
    if (context) {
      logMessage += this.ogmaGetter.getVal(context, color, Color.CYAN) + ' ';
    }
    logMessage += this.ogmaGetter.getMessage(log, rest) + '\n';
    process.stdout.write(Buffer.from(logMessage));
  }
}
