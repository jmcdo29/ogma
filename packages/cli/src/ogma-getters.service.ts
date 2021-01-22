import { Injectable } from '@nestjs/common';
import { Color, LogLevel } from '@ogma/logger';
import { colorizeCLI } from '@ogma/logger/lib/utils';
import { OgmaLog } from './ogma-file.interface';

@Injectable()
export class OgmaGetterService {
  getMessage(log: OgmaLog, rest: Record<string, string>): string {
    return log.message || JSON.stringify(rest);
  }
  getLevelColor(level: keyof typeof LogLevel): Color {
    let color: Color;
    switch (level) {
      case 'SILLY':
        color = Color.MAGENTA;
        break;
      case 'FINE':
        color = Color.GREEN;
        break;
      case 'DEBUG':
        color = Color.BLUE;
        break;
      case 'INFO':
        color = Color.CYAN;
        break;
      case 'WARN':
        color = Color.YELLOW;
        break;
      case 'ERROR':
      case 'FATAL':
        color = Color.RED;
    }
    return color;
  }

  getVal(val: string, useColor: boolean, color: Color): string {
    val = this.wrapInParens(val);
    if (useColor) {
      val = colorizeCLI(val, color);
    }
    return val;
  }

  wrapInParens(val: string): string {
    return `[${val}]`;
  }

  getLevel(level: keyof typeof LogLevel, useColor: boolean): string {
    let retString = this.wrapInParens(level).padEnd(7, ' ');
    if (useColor) {
      retString = colorizeCLI(retString, this.getLevelColor(level));
    }
    return retString;
  }
}
