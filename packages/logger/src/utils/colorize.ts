import { Color, OgmaSimpleType, OgmaStream } from '@ogma/common';

const ESC = '\x1B';

export function colorize(
  value: OgmaSimpleType,
  color: Color = Color.WHITE,
  useColor = true,
  stream: OgmaStream = process.stdout,
): string {
  if (stream.hasColors && stream.hasColors() && useColor) {
    value = `${ESC}[3${color}m${value}${ESC}[0m`;
  }
  return value.toString();
}
