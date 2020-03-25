import { Color } from '../enums';
import { OgmaSimpleType } from '../types';

const ESC = '\x1B';

export function colorize(
  value: OgmaSimpleType,
  color: Color = Color.WHITE,
  useColor = true,
  stream: Partial<NodeJS.WritableStream | NodeJS.WriteStream> = process.stdout,
): string {
  if (
    (stream as NodeJS.WriteStream).hasColors &&
    (stream as NodeJS.WriteStream).hasColors() &&
    useColor
  ) {
    value = `${ESC}[3${color}m${value}${ESC}[0m`;
  }
  return value.toString();
}

export function colorizeCLI(
  value: OgmaSimpleType,
  color: Color = Color.WHITE,
  useColor = true,
): string {
  if (useColor) {
    value = `${ESC}[3${color}m${value}${ESC}[0m`;
  }
  return value.toString();
}
