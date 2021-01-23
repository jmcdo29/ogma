import { Injectable } from '@nestjs/common';
import { Color, LogLevel } from '@ogma/logger';
import { OgmaLog } from './ogma-file.interface';

@Injectable()
export class OgmaGetterService {
  private ESC = '\x1B';
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
      val = this.colorizeCLI(val, color);
    }
    return val;
  }

  private colorizeCLI(value: string, color: Color = Color.WHITE, useColor = true): string {
    if (useColor) {
      value = `${this.ESC}[3${color}m${value}${this.ESC}[0m`;
    }
    return value.toString();
  }

  wrapInParens(val: string): string {
    return `[${val}]`;
  }

  getLevel(level: keyof typeof LogLevel, useColor: boolean): string {
    let retString = this.wrapInParens(level).padEnd(7, ' ');
    if (useColor) {
      retString = this.colorizeCLI(retString, this.getLevelColor(level));
    }
    return retString;
  }
}
