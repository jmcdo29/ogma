import { OgmaStream } from '@ogma/common';

export class Styler {
  private stylesToApply = [];
  protected colorMap = {
    black: '0',
    red: '1',
    green: '2',
    yellow: '3',
    blue: '4',
    magenta: '5',
    cyan: '6',
    white: '7',
  };

  public get black() {
    return this.color(this.colorMap.black);
  }
  public get blackBg() {
    return this.bgColor(this.colorMap.black);
  }
  public get bBlack() {
    return this.brightColor(this.colorMap.black);
  }
  public get bBlackBg() {
    return this.brightColor(this.colorMap.black);
  }
  public get red() {
    return this.color(this.colorMap.red);
  }
  public get redBg() {
    return this.bgColor(this.colorMap.red);
  }
  public get bRed() {
    return this.brightColor(this.colorMap.red);
  }
  public get bRedBg() {
    return this.brightBgColor(this.colorMap.red);
  }
  public get green() {
    return this.color(this.colorMap.green);
  }
  public get greenBg() {
    return this.bgColor(this.colorMap.green);
  }
  public get bGreen() {
    return this.brightColor(this.colorMap.green);
  }
  public get bGreenBg() {
    return this.brightBgColor(this.colorMap.green);
  }
  public get yellow() {
    return this.color(this.colorMap.yellow);
  }
  public get bYellow() {
    return this.brightColor(this.colorMap.yellow);
  }
  public get yellowBg() {
    return this.bgColor(this.colorMap.yellow);
  }

  public get bYellowBg() {
    return this.brightBgColor(this.colorMap.yellow);
  }
  public get blue() {
    return this.color(this.colorMap.blue);
  }
  public get blueBg() {
    return this.bgColor(this.colorMap.blue);
  }
  public get bBlue() {
    return this.brightColor(this.colorMap.blue);
  }
  public get bBlueBg() {
    return this.brightBgColor(this.colorMap.blue);
  }
  public get magenta() {
    return this.color(this.colorMap.magenta);
  }
  public get magentaBg() {
    return this.bgColor(this.colorMap.magenta);
  }
  public get bMagenta() {
    return this.brightColor(this.colorMap.magenta);
  }
  public get bMagentaBg() {
    return this.brightBgColor(this.colorMap.magenta);
  }
  public get cyan() {
    return this.color(this.colorMap.cyan);
  }
  public get cyanBg() {
    return this.bgColor(this.colorMap.cyan);
  }
  public get bCyan() {
    return this.brightColor(this.colorMap.cyan);
  }
  public get bCyanBg() {
    return this.brightBgColor(this.colorMap.cyan);
  }
  public get white() {
    return this.color(this.colorMap.white);
  }
  public get whiteBg() {
    return this.bgColor(this.colorMap.white);
  }
  public get bWhite() {
    return this.brightColor(this.colorMap.white);
  }
  public get bWhiteBg() {
    return this.brightBgColor(this.colorMap.white);
  }
  public get bold() {
    return this.addStyle('bold');
  }
  public get faint() {
    return this.addStyle('faint');
  }
  public get italic() {
    return this.addStyle('italic');
  }
  public get underline() {
    return this.addStyle('underline');
  }
  public get blink() {
    return this.addStyle('blink');
  }
  public get fastBlink() {
    return this.addStyle('fast-blink');
  }
  public get invert() {
    return this.addStyle('invert');
  }
  public get strikeThrough() {
    return this.addStyle('strike');
  }
  public get doubleUnderline() {
    return this.addStyle('double-underline');
  }
  public get reveal() {
    return this.addStyle('reveal');
  }
  public get framed() {
    return this.addStyle('framed');
  }
  public get encircled() {
    return this.addStyle('encircled');
  }
  public get overlined() {
    return this.addStyle('overlined');
  }
  public get superscript() {
    return this.addStyle('super');
  }
  public get subscript() {
    return this.addStyle('sub');
  }

  public constructor(private readonly stream: Pick<OgmaStream, 'getColorDepth'> = process.stdout) {}
  public apply(val: string | number | boolean) {
    const retString = `${this.stylesToApply.join('')}${val}\x1B[0m`;
    this.stylesToApply = [];
    return retString;
  }

  public bgColor(colorVal: string | number): this {
    return this.color(colorVal, 'background');
  }

  public brightBgColor(colorVal: string | number): this {
    return this.brightColor(colorVal, 'background');
  }

  public brightColor(
    colorVal: string | number,
    position: 'foreground' | 'background' = 'foreground',
  ): this {
    return this.color(colorVal, position, true);
  }

  public color(
    colorVal: string | number,
    position: 'foreground' | 'background' = 'foreground',
    bright = false,
  ): this {
    let applyStyle = '';
    if (position === 'foreground') {
      applyStyle = 'color';
    } else {
      applyStyle = 'colorbg';
    }
    if (bright) {
      applyStyle = `b${applyStyle}`;
    }
    if (typeof colorVal === 'number') {
      if (colorVal > 8) {
        colorVal = `8;5;${colorVal}`;
      } else {
        colorVal = colorVal.toString();
      }
    }
    return this.addStyle(applyStyle, colorVal);
  }

  public child(stream?: Pick<OgmaStream, 'getColorDepth'>): Styler {
    return new Styler(stream);
  }
  /**
   * @link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR
   */
  private addStyle(style: string, modification?: string) {
    let styleToAdd = '';
    switch (style) {
      case 'bold':
        styleToAdd = this.sgr(1);
        break;
      case 'faint':
        styleToAdd = this.sgr(2);
        break;
      case 'italic':
        styleToAdd = this.sgr(3);
        break;
      case 'underline':
        styleToAdd = this.sgr(4);
        break;
      case 'blink':
        styleToAdd = this.sgr(5);
        break;
      case 'fast-blink':
        styleToAdd = this.sgr(6);
        break;
      case 'invert':
        styleToAdd = this.sgr(7);
        break;
      case 'conceal':
        styleToAdd = this.sgr(8);
        break;
      case 'strike':
        styleToAdd = this.sgr(9);
        break;
      case 'double-underline':
        styleToAdd = this.sgr(21);
        break;
      case 'reveal':
        styleToAdd = this.sgr(22);
        break;
      case 'color':
        styleToAdd = this.sgr(`3${modification}`);
        break;
      case 'colorbg':
        styleToAdd = this.sgr(`4${modification}`);
        break;
      case 'framed':
        styleToAdd = this.sgr(51);
        break;
      case 'encircled':
        styleToAdd = this.sgr(52);
        break;
      case 'overlined':
        styleToAdd = this.sgr(53);
        break;
      case 'super':
        styleToAdd = this.sgr(73);
        break;
      case 'sub':
        styleToAdd = this.sgr(74);
        break;
      case 'bcolor':
        styleToAdd = this.sgr(`9${modification}`);
        break;
      case 'bcolorbg':
        styleToAdd = this.sgr(`10${modification}`);
        break;
      default:
        break;
    }
    this.stylesToApply.push(styleToAdd);
    return this;
  }

  private sgr(val: number | string): string {
    return `\x1B[${val.toString()}m`;
  }
}
