import { Color, OgmaLog } from '@ogma/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { from, iif, Observable, of, OperatorFunction, pipe } from 'rxjs';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { FileService } from './file.service';
import { badFormat } from './messages';
import { OgmaGetterService } from './ogma-getters.service';
import { StreamService } from './stream.service';

@Command({
  name: 'hydrate',
  arguments: '[file]',
  description: 'Hydrate a file from being a JSON Ogma log to a dev friendly format',
  argsDescription: {
    file: 'The file to be parsed from JSON to dev format',
  },
  options: { isDefault: true },
})
export class OgmaCommand extends CommandRunner {
  constructor(
    private readonly fileService: FileService,
    private readonly streamService: StreamService,
    private readonly ogmaGetter: OgmaGetterService,
  ) {
    super();
  }
  private ogmaKeys = ['time', 'pid', 'level'];

  async run(params: string[], options: { color: boolean }): Promise<void> {
    if (params[0]) {
      await this.runForFile(params[0], options);
    } else {
      await this.runForStdin(options);
    }
  }

  @Option({
    flags: '-c, --color [color]',
    description: 'If the output should be in color or not',
    defaultValue: process.stdout.isTTY,
  })
  praseBoolean(val?: string): boolean {
    return val ? JSON.parse(val) : true;
  }

  private async runForStdin(options: { color: boolean }): Promise<void> {
    return new Promise((resolve, reject) => {
      const { log: log$, done: done$ } = this.streamService.readFromStream(process.stdin);
      log$.pipe(this.streamLogOps(options, done$)).subscribe({
        error: reject,
        complete: resolve,
      });
    });
  }

  private streamLogOps(
    options: { color: boolean },
    done$: Observable<any>,
  ): OperatorFunction<string, Record<string, unknown>> {
    return pipe(
      mergeMap((val) => {
        return iif(() => val.includes('\n'), from(val.split('\n')), of(val));
      }),
      filter((log) => this.checkOgmaFormat(log)),
      map((jsonLogString) => JSON.parse(jsonLogString)),
      tap((logString) => this.writeLog(logString, options.color)),
      takeUntil(done$),
    );
  }

  private async runForFile(fileName: string, options: { color: boolean }): Promise<void> {
    const logs = (await this.readFile(fileName)).filter((log) => log.trim().length !== 0);
    if (!logs.every((log) => this.checkOgmaFormat(log))) {
      throw new Error(badFormat);
    }
    logs
      .map((log) => {
        return JSON.parse(log);
      })
      .forEach((log: OgmaLog) => this.writeLog(log, options.color));
  }

  private async readFile(fileName: string): Promise<string[]> {
    return (await this.fileService.read(fileName)).split('\n');
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
    const { time, hostname, application, context, pid, ool, level: _level, ...rest } = log;
    let logMessage = this.ogmaGetter.wrapInParens(time.toString()) + ' ';
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
