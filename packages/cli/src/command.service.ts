import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { ArgKeyMap, OgmaArgs } from './command-args.interface';

const { readFile } = promises;

@Injectable()
export class CommandService {
  private validFlags = Object.keys(ArgKeyMap);

  private ogmaKeys = ['time', 'pid', 'level'];

  async act(args: string[]) {
    const options = this.validateArgs(args);
    const fileContents = await this.readFile(options.file);
  }

  validateArgs(args: string[]): OgmaArgs {
    const retArgs: OgmaArgs = {
      file: '',
      color: process.stdout.isTTY,
    };
    retArgs.file = args.filter((arg) => !arg.includes('--'))[0];
    if (!args.length || args.length > 2) {
      throw new Error('Invalid usage');
    }
    const flags = args.filter((arg) => arg.includes('--'));
    const flagKeys = flags.map((flag) => flag.split('=')[0]);
    if (args.length > 1 && !flagKeys.every((flag) => this.validFlags.includes(flag))) {
      throw new Error('Invalid options');
    }
    flags.forEach((flag) => {
      const [key, value] = flag.split('=');
      retArgs[ArgKeyMap[key]] = value ? JSON.parse(value) : true;
    });
    return retArgs;
  }

  async readFile(fileName: string): Promise<string> {
    const file = await readFile(join(process.cwd(), fileName));
    return file.toString();
  }

  isOgmaFormat(log: Record<string, any>): boolean {
    return this.ogmaKeys.every((key) => Object.prototype.hasOwnProperty.call(log, key));
  }
}
