import { Color } from '@ogma/common';
import { style } from '@ogma/styler';
import { match } from 'assert';
import { suite } from 'uvu';
import { is } from 'uvu/assert';
import { colorize } from '../src/utils/colorize';

const ESC = '\x1B';

for (const colored of [true, false]) {
  for (const colorVal of [
    Color.RED,
    Color.GREEN,
    Color.YELLOW,
    Color.BLUE,
    Color.MAGENTA,
    Color.CYAN,
    Color.WHITE,
  ]) {
    const ColorSuite = suite(`colorize with colors ${colored} for color ${Color[colorVal]}`);
    for (const val of ['hello', 42, true]) {
      ColorSuite(`colorize ${val}`, () => {
        const styler = style.child(process.stdout);
        const retVal = colorize(val, colorVal, styler, colored);
        if (!colored) {
          is(retVal, val.toString());
        } else {
          is(retVal, `${ESC}[3${colorVal}m${val}${ESC}[0m`);
          match(retVal, /^\x1B\[3\d{1}m\w{2,5}\x1B\[0m$/);
        }
      });
    }
    ColorSuite.run();
  }
}

const DefaultImplSuite = suite('colorize defaults');
DefaultImplSuite('it should still print', () => {
  is(colorize('hello'), `${ESC}[37mhello${ESC}[0m`);
});
DefaultImplSuite.run();

const NoColorSuite = suite('No colors for streams that do not support them');
NoColorSuite.before(() => {
  process.env.NO_COLOR = 'true';
});
NoColorSuite.after(() => {
  delete process.env.NO_COLOR;
});
NoColorSuite('it should still print, just without the SGRs', () => {
  is(colorize('hello', Color.BLUE, style.child({ getColorDepth: () => 1 }), true), 'hello');
});
NoColorSuite.run();
