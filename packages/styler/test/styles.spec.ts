import './utils';
import { style } from '../src';
import { Styler } from '../src/styler';

type ColorConst = 'black' | 'red' | 'yellow' | 'green' | 'blue' | 'magenta' | 'cyan' | 'white';

const hello = 'Hello World!';

describe('@ogma/styler', () => {
  describe('underline', () => {
    it('should add the underline SGR', () => {
      const underlined = style.underline.apply(hello);
      expect(underlined).toBeStringStyledWith('\x1B[4m');
    });
  });
  describe('blink', () => {
    it('should apply the blink SRG', () => {
      const blinking = style.blink.apply(hello);
      expect(blinking).toBeStringStyledWith('\x1B[5m');
    });
  });
  describe('color', () => {
    describe('background', () => {
      it('should apply a general background color', () => {
        const bgColored = style.bgColor(138).apply(hello);
        expect(bgColored).toBeStringStyledWith('\x1B[48;5;138m');
      });
    });
    describe('foreground', () => {
      it('should apply a general foreground color', () => {
        const fgColored = style.color(93).apply(hello);
        expect(fgColored).toBeStringStyledWith('\x1B[38;5;93m');
      });
    });
    describe('both', () => {
      it('should apply two styles, one for fore and one fro background', () => {
        const colored = style.color(45).color(193, 'background').apply(hello);
        expect(colored).toBeStringStyledWith('\x1B[38;5;45m', '\x1B[48;5;193m');
      });
    });
  });
  describe('color constants', () => {
    describe.each`
      depth | prefixCreator                       | expectMethod
      ${1}  | ${() => hello}                      | ${'toBe'}
      ${4}  | ${(val: string) => `\x1B[3${val}m`} | ${'toBeStringStyledWith'}
    `(
      'processes color depth = $depth',
      ({
        prefixCreator,
        depth,
        expectMethod,
      }: {
        prefixCreator: (val: string) => string;
        depth: number;
        expectMethod: string;
      }) => {
        let styler: Styler;
        beforeEach(() => {
          styler = style.child({ getColorDepth: () => depth });
        });
        it.each`
          color        | code
          ${'black'}   | ${'0'}
          ${'red'}     | ${'1'}
          ${'green'}   | ${'2'}
          ${'yellow'}  | ${'3'}
          ${'blue'}    | ${'4'}
          ${'magenta'} | ${'5'}
          ${'cyan'}    | ${'6'}
          ${'white'}   | ${'7'}
        `(
          'should apply $code for $color',
          ({ color, code }: { color: ColorConst; code: string }) => {
            const colored = styler[color].apply(hello);
            expect(colored)[expectMethod](prefixCreator(code));
          },
        );
      },
    );
  });
  describe('Mixed decorations', () => {
    it('should apply blue, underlined, and blinking', () => {
      const mixed = style.underline.blink.blue.apply(hello);
      expect(mixed).toBeStringStyledWith('\x1B[4m', '\x1B[5m', '\x1B[34m');
    });
  });
  describe('Off Scenarios', () => {
    it('should still log styles, but not colors for NO_COLOR', () => {
      const ogNO_COLOR = process.env.NO_COLOR;
      process.env.NO_COLOR = 'true';
      const ncStyle = style.child();
      expect(ncStyle.blue.apply(hello)).toBe(hello);
      expect(ncStyle.underline.apply('Hello World!')).toBeStringStyledWith('\x1B[4m');
      expect(ncStyle.bBlue.blueBg.apply(hello)).toBe(hello);
      process.env.NO_COLOR = ogNO_COLOR;
    });
    it('should apply no styling if NO_STYLE is set', () => {
      const ogNO_STYLE = process.env.NO_STYLE;
      process.env.NO_STYLE = 'true';
      const nsStyle = style.child();
      expect(nsStyle.blue.underline.blink.apply(hello)).toBe(hello);
      process.env.NO_STYLE = ogNO_STYLE;
    });
  });
});
