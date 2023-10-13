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
  public get black() {
    return this.sgr(colorMap[Style.BLACK]);
  }
  public get blackBg() {
    return this.sgr(colorMap[Style.BLACKBG]);
  }
  public get bBlack() {
    return this.sgr(colorMap[Style.BRIGHTBLACK]);
  }
  public get bBlackBg() {
    return this.sgr(colorMap[Style.BRIGHTBLACKBG]);
  }
  public get red() {
    return this.sgr(colorMap[Style.RED]);
  }
  public get redBg() {
    return this.sgr(colorMap[Style.REDBG]);
  }
  public get bRed() {
    return this.sgr(colorMap[Style.BRIGHTRED]);
  }
  public get bRedBg() {
    return this.sgr(colorMap[Style.BRIGHTREDBG]);
  }
  public get green() {
    return this.sgr(colorMap[Style.GREEN]);
  }
  public get greenBg() {
    return this.sgr(colorMap[Style.GREENBG]);
  }
  public get bGreen() {
    return this.sgr(colorMap[Style.BRIGHTGREEN]);
  }
  public get bGreenBg() {
    return this.sgr(colorMap[Style.BRIGHTGREENBG]);
  }
  public get yellow() {
    return this.sgr(colorMap[Style.YELLOW]);
  }
  public get yellowBg() {
    return this.sgr(colorMap[Style.YELLOWBG]);
  }
  public get bYellow() {
    return this.sgr(colorMap[Style.BRIGHTYELLOW]);
  }
  public get bYellowBg() {
    return this.sgr(colorMap[Style.BRIGHTYELLOWBG]);
  }
  public get blue() {
    return this.sgr(colorMap[Style.BLUE]);
  }
  public get blueBg() {
    return this.sgr(colorMap[Style.BLUEBG]);
  }
  public get bBlue() {
    return this.sgr(colorMap[Style.BRIGHTBLUE]);
  }
  public get bBlueBg() {
    return this.sgr(colorMap[Style.BRIGHTBLUEBG]);
  }
  public get magenta() {
    return this.sgr(colorMap[Style.MAGENTA]);
  }
  public get magentaBg() {
    return this.sgr(colorMap[Style.MAGENTABG]);
  }
  public get bMagenta() {
    return this.sgr(colorMap[Style.BRIGHTMAGENTA]);
  }
  public get bMagentaBg() {
    return this.sgr(colorMap[Style.BRIGHTMAGENTABG]);
  }
  public get cyan() {
    return this.sgr(colorMap[Style.CYAN]);
  }
  public get cyanBg() {
    return this.sgr(colorMap[Style.CYANBG]);
  }
  public get bCyan() {
    return this.sgr(colorMap[Style.BRIGHTCYAN]);
  }
  public get bCyanBg() {
    return this.sgr(colorMap[Style.BIRGHTCYANBG]);
  }
  public get white() {
    return this.sgr(colorMap[Style.WHITE]);
  }
  public get whiteBg() {
    return this.sgr(colorMap[Style.WHITEBG]);
  }
  public get bWhite() {
    return this.sgr(colorMap[Style.BRIGHTWHIET]);
  }
  public get bWhiteBg() {
    return this.sgr(colorMap[Style.BRIGHTWHITEBG]);
  }
  public get bold() {
    return this.sgr(colorMap[Style.BOLD]);
  }
  public get faint() {
    return this.sgr(colorMap[Style.FAINT]);
  }
  public get italic() {
    return this.sgr(colorMap[Style.ITALIC]);
  }
  public get underline() {
    return this.sgr(colorMap[Style.UNDERLINE]);
  }
  public get blink() {
    return this.sgr(colorMap[Style.BLINK]);
  }
  public get fastBlink() {
    return this.sgr(colorMap[Style.FASTBLINK]);
  }
  public get invert() {
    return this.sgr(colorMap[Style.INVERT]);
  }
  public get strikeThrough() {
    return this.sgr(colorMap[Style.STRIKE]);
  }
  public get doubleUnderline() {
    return this.sgr(colorMap[Style.DOUBLEUNDERLINE]);
  }
  public get reveal() {
    return this.sgr(colorMap[Style.REVEAL]);
  }
  public get framed() {
    return this.sgr(colorMap[Style.FRAMED]);
  }
  public get encircled() {
    return this.sgr(colorMap[Style.ENCIRCLED]);
  }
  public get overlined() {
    return this.sgr(colorMap[Style.OVERLINED]);
  }
  public get superscript() {
    return this.sgr(colorMap[Style.SUPER]);
  }
  public get subscript() {
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
    if (this.stylesToApply === '') {
      return val.toString();
    }
    if (typeof val === 'string' && /\x1B\[0m/.test(val)) {
      val = val.replace(/\x1B\[0m/g, `\x1B[0m${this.stylesToApply}`);
    }
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
