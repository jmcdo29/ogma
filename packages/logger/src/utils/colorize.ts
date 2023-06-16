import { Color, OgmaSimpleType } from '@ogma/common';
import { style as styler, Styler } from '@ogma/styler';

const colorizeMap: Record<Color, string> = {
  [Color.BLACK]: 'black',
  [Color.RED]: 'red',
  [Color.GREEN]: 'green',
  [Color.YELLOW]: 'yellow',
  [Color.BLUE]: 'blue',
  [Color.MAGENTA]: 'magenta',
  [Color.CYAN]: 'cyan',
  [Color.WHITE]: 'white',
};

export function colorize(
  value: OgmaSimpleType,
  color: Color = Color.WHITE,
  style: Styler = styler,
  useColor = true,
): string {
  if (useColor) {
    return style[colorizeMap[color]].apply(value);
  }

  return value.toString();
}
