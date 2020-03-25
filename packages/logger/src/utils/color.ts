import { Color } from '../enums';
import { OgmaSimpleType } from '../types';
import { colorize } from './colorize';

export const color = {
  /**
   * Print your text in red. Send in a OgmaSimpleType and the output will be red.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in red
   */
  red: (value: OgmaSimpleType) => colorize(value, Color.RED),
  /**
   * Print your text in green. Send in a OgmaSimpleType and the output will be green.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in green.
   */
  green: (value: OgmaSimpleType) => colorize(value, Color.GREEN),
  /**
   * Print your text in yellow. Send in a OgmaSimpleType and the output will be yellow.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in yellow.
   */
  yellow: (value: OgmaSimpleType) => colorize(value, Color.YELLOW),
  /**
   * Print your text in blue. Send in a OgmaSimpleType and the output will be blue.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in blue.
   */
  blue: (value: OgmaSimpleType) => colorize(value, Color.BLUE),
  /**
   * Print your text in magenta. Send in a OgmaSimpleType and the output will be magenta.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in magenta.
   */
  magenta: (value: OgmaSimpleType) => colorize(value, Color.MAGENTA),
  /**
   * Print your text in cyan. Send in a OgmaSimpleType and the output will be cyan.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in cyan.
   */
  cyan: (value: OgmaSimpleType) => colorize(value, Color.CYAN),
  /**
   * Print your text in white. Send in a OgmaSimpleType and the output will be white.
   *
   * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in white.
   */
  white: (value: OgmaSimpleType) => colorize(value, Color.WHITE),
};
