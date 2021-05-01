import { createMock } from '@golevelup/ts-jest';
import { Color, OgmaSimpleType } from '@ogma/common';
import { style } from '../../styler/lib';
import { colorize } from '../src/utils/colorize';

const ESC = '\x1B';

describe.each([[{ useColor: true }], [{ useColor: false }]])('colorize %j', (options) => {
  describe.each([
    ['red', Color.RED],
    ['green', Color.GREEN],
    ['yellow', Color.YELLOW],
    ['blue', Color.BLUE],
    ['magenta', Color.MAGENTA],
    ['cyan', Color.CYAN],
    ['white', Color.WHITE],
  ])('print in %s', (colorName, colorEnum) => {
    it.each(['hello', 42, true])('print %o', (value: OgmaSimpleType) => {
      const styler = style.child(process.stdout);
      const retVal = colorize(value, colorEnum as Color, styler, options.useColor);
      if (!options.useColor) {
        expect(retVal).toBe(value.toString());
      } else {
        expect(retVal).toBe(ESC + '[3' + colorEnum + 'm' + value + ESC + '[0m');
        expect(/^\u001b\[3\d{1}m\w{2,5}\u001b\[0m$/.test(retVal)).toBeTruthy();
      }
    });
  });
});
describe('colorize defaults', () => {
  it('should print with defaults', () => {
    const hasColors = process.stdout.hasColors;
    process.stdout.hasColors = () => true;
    expect(colorize('hello')).toBe(ESC + '[37mhello' + ESC + '[0m');
    process.stdout.hasColors = hasColors;
  });
});
describe('it should not print colors with a stream that does not support colors', () => {
  it('should still print', () => {
    expect(colorize('hello', Color.BLUE, style.child({ getColorDepth: () => 1 }), true)).toBe(
      'hello\x1B[0m',
    );
  });
});
