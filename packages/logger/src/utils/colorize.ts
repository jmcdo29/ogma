import { Color, OgmaSimpleType } from '@ogma/common';
import { style as styler, Styler } from '@ogma/styler';

export function colorize(
  value: OgmaSimpleType,
  color: Color = Color.WHITE,
  style: Styler = styler,
  useColor = true,
): string {
  if (useColor) {
    value = style.color(color).apply(value);
  }
  return value.toString();
}
