import { OgmaStream } from '@ogma/common';
import { Style } from './style.enum';

export class Styler {
  private stylesToApply = [];
  private colorDepth = 16;
  private useStyle = true;
  public get black() {
    return this.sgr(Style.BLACK);
  }
  public get blackBg() {
    return this.sgr(Style.BLACKBG);
  }
  public get bBlack() {
    return this.sgr(Style.BRIGHTBLACK);
  }
  public get bBlackBg() {
    return this.sgr(Style.BRIGHTBLACKBG);
  }
  public get red() {
    return this.sgr(Style.RED);
  }
  public get redBg() {
    return this.sgr(Style.REDBG);
  }
  public get bRed() {
    return this.sgr(Style.BRIGHTRED);
  }
  public get bRedBg() {
    return this.sgr(Style.BRIGHTREDBG);
  }
  public get green() {
    return this.sgr(Style.GREEN);
  }
  public get greenBg() {
    return this.sgr(Style.GREENBG);
  }
  public get bGreen() {
    return this.sgr(Style.BRIGHTGREEN);
  }
  public get bGreenBg() {
    return this.sgr(Style.BRIGHTGREENBG);
  }
  public get yellow() {
    return this.sgr(Style.YELLOW);
  }
  public get yellowBg() {
    return this.sgr(Style.YELLOWBG);
  }
  public get bYellow() {
    return this.sgr(Style.BRIGHTYELLOW);
  }

  public get bYellowBg() {
    return this.sgr(Style.BRIGHTYELLOWBG);
  }
  public get blue() {
    return this.sgr(Style.BLUE);
  }
  public get blueBg() {
    return this.sgr(Style.BLUEBG);
  }
  public get bBlue() {
    return this.sgr(Style.BRIGHTBLUE);
  }
  public get bBlueBg() {
    return this.sgr(Style.BRIGHTBLUEBG);
  }
  public get magenta() {
    return this.sgr(Style.MAGENTA);
  }
  public get magentaBg() {
    return this.sgr(Style.MAGENTABG);
  }
  public get bMagenta() {
    return this.sgr(Style.BRIGHTMAGENTA);
  }
  public get bMagentaBg() {
    return this.sgr(Style.BRIGHTMAGENTABG);
  }
  public get cyan() {
    return this.sgr(Style.CYAN);
  }
  public get cyanBg() {
    return this.sgr(Style.CYANBG);
  }
  public get bCyan() {
    return this.sgr(Style.BRIGHTCYAN);
  }
  public get bCyanBg() {
    return this.sgr(Style.BIRGHTCYANBG);
  }
  public get white() {
    return this.sgr(Style.WHITE);
  }
  public get whiteBg() {
    return this.sgr(Style.WHITEBG);
  }
  public get bWhite() {
    return this.sgr(Style.BRIGHTWHIET);
  }
  public get bWhiteBg() {
    return this.sgr(Style.BRIGHTWHITEBG);
  }
  public get bold() {
    return this.sgr(Style.BOLD);
  }
  public get faint() {
    return this.sgr(Style.FAINT);
  }
  public get italic() {
    return this.sgr(Style.ITALIC);
  }
  public get underline() {
    return this.sgr(Style.UNDERLINE);
  }
  public get blink() {
    return this.sgr(Style.BLINK);
  }
  public get fastBlink() {
    return this.sgr(Style.FASTBLINK);
  }
  public get invert() {
    return this.sgr(Style.INVERT);
  }
  public get strikeThrough() {
    return this.sgr(Style.STRIKE);
  }
  public get doubleUnderline() {
    return this.sgr(Style.DOUBLEUNDERLINE);
  }
  public get reveal() {
    return this.sgr(Style.REVEAL);
  }
  public get framed() {
    return this.sgr(Style.FRAMED);
  }
  public get encircled() {
    return this.sgr(Style.ENCIRCLED);
  }
  public get overlined() {
    return this.sgr(Style.OVERLINED);
  }
  public get superscript() {
    return this.sgr(Style.SUPER);
  }
  public get subscript() {
    return this.sgr(Style.SUB);
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

  public apply(val: string | number | boolean) {
    const retString = `${this.stylesToApply.join('')}${val}\x1B[0m`;
    this.stylesToApply = [];
    return retString;
  }

  public bgColor(colorVal: string | number): this {
    return this.color(colorVal, 'background');
  }

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

  public child(stream?: Pick<OgmaStream, 'getColorDepth'>): Styler {
    return new Styler(stream);
  }

  /**
   * @link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR
   */
  private sgr(val: number | string): this {
    if (this.useStyle) {
      this.stylesToApply.push(`\x1B[${val.toString()}m`);
    }
    return this;
  }
}
