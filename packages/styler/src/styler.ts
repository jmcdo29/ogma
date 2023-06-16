import { OgmaStream } from '@ogma/common';

import { Style } from './style.enum';

const sgrColorMap = new Map([
  ['3', true],
  ['4', true],
  ['9', true],
]);

const colorMap: Record<Style, string> = {
  [Style.BLACK]: Style.BLACK.toString(),
  [Style.BLACKBG]: Style.BLACKBG.toString(),
  [Style.BRIGHTBLACK]: Style.BRIGHTBLACK.toString(),
  [Style.BRIGHTBLACKBG]: Style.BRIGHTBLACKBG.toString(),
  [Style.RED]: Style.RED.toString(),
  [Style.REDBG]: Style.REDBG.toString(),
  [Style.BRIGHTRED]: Style.BRIGHTRED.toString(),
  [Style.BRIGHTREDBG]: Style.BRIGHTREDBG.toString(),
  [Style.GREEN]: Style.GREEN.toString(),
  [Style.GREENBG]: Style.GREENBG.toString(),
  [Style.BRIGHTGREEN]: Style.BRIGHTGREEN.toString(),
  [Style.BRIGHTGREENBG]: Style.BRIGHTGREENBG.toString(),
  [Style.YELLOW]: Style.YELLOW.toString(),
  [Style.YELLOWBG]: Style.YELLOWBG.toString(),
  [Style.BRIGHTYELLOW]: Style.BRIGHTYELLOW.toString(),
  [Style.BRIGHTYELLOWBG]: Style.BRIGHTYELLOWBG.toString(),
  [Style.BLUE]: Style.BLUE.toString(),
  [Style.BLUEBG]: Style.BLUEBG.toString(),
  [Style.BRIGHTBLUE]: Style.BRIGHTBLUE.toString(),
  [Style.MAGENTA]: Style.MAGENTA.toString(),
  [Style.MAGENTABG]: Style.MAGENTABG.toString(),
  [Style.BRIGHTMAGENTA]: Style.BRIGHTMAGENTA.toString(),
  [Style.BRIGHTMAGENTABG]: Style.BRIGHTMAGENTABG.toString(),
  [Style.CYAN]: Style.CYAN.toString(),
  [Style.CYANBG]: Style.CYANBG.toString(),
  [Style.BRIGHTCYAN]: Style.BRIGHTCYAN.toString(),
  [Style.BIRGHTCYANBG]: Style.BIRGHTCYANBG.toString(),
  [Style.WHITE]: Style.WHITE.toString(),
  [Style.WHITEBG]: Style.WHITEBG.toString(),
  [Style.BRIGHTWHIET]: Style.BRIGHTWHIET.toString(),
  [Style.BRIGHTWHITEBG]: Style.BRIGHTWHITEBG.toString(),
  [Style.BOLD]: Style.BOLD.toString(),
  [Style.FAINT]: Style.FAINT.toString(),
  [Style.ITALIC]: Style.ITALIC.toString(),
  [Style.UNDERLINE]: Style.UNDERLINE.toString(),
  [Style.BLINK]: Style.BLINK.toString(),
  [Style.FASTBLINK]: Style.FASTBLINK.toString(),
  [Style.INVERT]: Style.INVERT.toString(),
  [Style.STRIKE]: Style.STRIKE.toString(),
  [Style.DOUBLEUNDERLINE]: Style.DOUBLEUNDERLINE.toString(),
  [Style.REVEAL]: Style.REVEAL.toString(),
  [Style.FRAMED]: Style.FRAMED.toString(),
  [Style.ENCIRCLED]: Style.ENCIRCLED.toString(),
  [Style.OVERLINED]: Style.OVERLINED.toString(),
  [Style.SUPER]: Style.SUPER.toString(),
  [Style.SUB]: Style.SUB.toString(),
  [Style.NONE]: Style.NONE.toString(),
  [Style.CONCEAL]: Style.CONCEAL.toString(),
  [Style.COLOR]: Style.COLOR.toString(),
  [Style.BGCOLOR]: Style.BGCOLOR.toString(),
  [Style.BRIGHTBLUEBG]: Style.BRIGHTBLUEBG.toString(),
};

export class Styler {
  private stylesToApply = '';
  private colorDepth = 16;
  private useStyle = true;
  public black() {
    return this.sgr(colorMap[Style.BLACK]);
  }
  public blackBg() {
    return this.sgr(colorMap[Style.BLACKBG]);
  }
  public bBlack() {
    return this.sgr(colorMap[Style.BRIGHTBLACK]);
  }
  public bBlackBg() {
    return this.sgr(colorMap[Style.BRIGHTBLACKBG]);
  }
  public red() {
    return this.sgr(colorMap[Style.RED]);
  }
  public redBg() {
    return this.sgr(colorMap[Style.REDBG]);
  }
  public bRed() {
    return this.sgr(colorMap[Style.BRIGHTRED]);
  }
  public bRedBg() {
    return this.sgr(colorMap[Style.BRIGHTREDBG]);
  }
  public green() {
    return this.sgr(colorMap[Style.GREEN]);
  }
  public greenBg() {
    return this.sgr(colorMap[Style.GREENBG]);
  }
  public bGreen() {
    return this.sgr(colorMap[Style.BRIGHTGREEN]);
  }
  public bGreenBg() {
    return this.sgr(colorMap[Style.BRIGHTGREENBG]);
  }
  public yellow() {
    return this.sgr(colorMap[Style.YELLOW]);
  }
  public yellowBg() {
    return this.sgr(colorMap[Style.YELLOWBG]);
  }
  public bYellow() {
    return this.sgr(colorMap[Style.BRIGHTYELLOW]);
  }
  public bYellowBg() {
    return this.sgr(colorMap[Style.BRIGHTYELLOWBG]);
  }
  public blue() {
    return this.sgr(colorMap[Style.BLUE]);
  }
  public blueBg() {
    return this.sgr(colorMap[Style.BLUEBG]);
  }
  public bBlue() {
    return this.sgr(colorMap[Style.BRIGHTBLUE]);
  }
  public bBlueBg() {
    return this.sgr(colorMap[Style.BRIGHTBLUEBG]);
  }
  public magenta() {
    return this.sgr(colorMap[Style.MAGENTA]);
  }
  public magentaBg() {
    return this.sgr(colorMap[Style.MAGENTABG]);
  }
  public bMagenta() {
    return this.sgr(colorMap[Style.BRIGHTMAGENTA]);
  }
  public bMagentaBg() {
    return this.sgr(colorMap[Style.BRIGHTMAGENTABG]);
  }
  public cyan() {
    return this.sgr(colorMap[Style.CYAN]);
  }
  public cyanBg() {
    return this.sgr(colorMap[Style.CYANBG]);
  }
  public bCyan() {
    return this.sgr(colorMap[Style.BRIGHTCYAN]);
  }
  public bCyanBg() {
    return this.sgr(colorMap[Style.BIRGHTCYANBG]);
  }
  public white() {
    return this.sgr(colorMap[Style.WHITE]);
  }
  public whiteBg() {
    return this.sgr(colorMap[Style.WHITEBG]);
  }
  public bWhite() {
    return this.sgr(colorMap[Style.BRIGHTWHIET]);
  }
  public bWhiteBg() {
    return this.sgr(colorMap[Style.BRIGHTWHITEBG]);
  }
  public bold() {
    return this.sgr(colorMap[Style.BOLD]);
  }
  public faint() {
    return this.sgr(colorMap[Style.FAINT]);
  }
  public italic() {
    return this.sgr(colorMap[Style.ITALIC]);
  }
  public underline() {
    return this.sgr(colorMap[Style.UNDERLINE]);
  }
  public blink() {
    return this.sgr(colorMap[Style.BLINK]);
  }
  public fastBlink() {
    return this.sgr(colorMap[Style.FASTBLINK]);
  }
  public invert() {
    return this.sgr(colorMap[Style.INVERT]);
  }
  public strikeThrough() {
    return this.sgr(colorMap[Style.STRIKE]);
  }
  public doubleUnderline() {
    return this.sgr(colorMap[Style.DOUBLEUNDERLINE]);
  }
  public reveal() {
    return this.sgr(colorMap[Style.REVEAL]);
  }
  public framed() {
    return this.sgr(colorMap[Style.FRAMED]);
  }
  public encircled() {
    return this.sgr(colorMap[Style.ENCIRCLED]);
  }
  public overlined() {
    return this.sgr(colorMap[Style.OVERLINED]);
  }
  public superscript() {
    return this.sgr(colorMap[Style.SUPER]);
  }
  public subscript() {
    return this.sgr(colorMap[Style.SUB]);
  }

  public constructor(stream: Pick<OgmaStream, 'getColorDepth'> = process.stdout) {
    if (stream.getColorDepth) {
      this.colorDepth = stream.getColorDepth();
    }

    if (process.env.FORCE_COLOR) {
      this.colorDepth = [1, 4, 8, 24][Number.parseInt(process.env.FORCE_COLOR)] ?? this.colorDepth;
    }
    if (process.env.NO_COLOR || process.env.NODE_DISABLE_COLOR) {
      this.colorDepth = 1;
    }
    if (process.env.NO_STYLE) {
      this.useStyle = false;
    }
  }

  /**
   * The final method in a style chain that applies all of the styles to the value.
   * If there are no styles to apply, the value is returned untouched.
   * @param val the value to add styling to
   * @returns A string that has the proper SGR values
   */
  public apply(val: string | number | boolean) {
    if (this.stylesToApply === '') return val.toString();

    const returnValue = `${this.stylesToApply}${val}\x1B[0m`;

    this.stylesToApply = '';

    return returnValue;
  }

  /**
   * A helper method for easily setting the background color
   * @param colorVal The numeric value or string value for the color to apply
   */
  public bgColor(colorVal: string | number): this {
    return this.color(colorVal, 'background');
  }

  /**
   * A helper method for setting the color for a string. This color is in the form of `[38;5;<number>m`. This format comes from the 8-bit color rendition. See the linked table for more options
   *
   * If the `colorDepth` for the styler is `1`, then no sgr will be added to the styles to apply.
   * @param colorVal The numeric value or string value for the color to apply
   * @param position background or foreground. Defaults to foreground
   * @see https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
   */
  public color(
    colorVal: string | number,
    position: 'foreground' | 'background' = 'foreground',
  ): this {
    let applyStyle = '';
    if (position === 'foreground') {
      applyStyle = `${Style.COLOR};5;${colorVal}`;
    } else {
      applyStyle = `${Style.BGCOLOR};5;${colorVal}`;
    }
    if (this.colorDepth === 1) {
      return this;
    }
    return this.sgr(applyStyle);
  }

  /**
   * A method for creating a new instance of the Styler class. This is useful for when you want to have one stream for your logger and a different one set for the styler (forced colors). Or it is useful in general for test cases.
   * @param stream a new stream instance
   * @returns a new Styler instance
   */
  public child(stream?: Pick<OgmaStream, 'getColorDepth'>): Styler {
    return new Styler(stream);
  }

  /**
   * @link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR
   */
  private sgr(val: string): this {
    if (
      (this.colorDepth === 1 && val.length >= 2 && sgrColorMap.has(val[0])) ||
      (val[0] === '1' && val[1] === '0')
    ) {
      return this;
    }

    if (this.useStyle) {
      this.stylesToApply += `\x1B[${val}m`;
    }

    return this;
  }
}
