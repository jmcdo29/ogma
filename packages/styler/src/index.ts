import { Styler } from './styler';

/**
 * A class for adding class to your strings. Most of the styles here follow a predictable pattern
 *
 * #### Use
 *
 * start off with `style` and then chain whatever you want to apply to the string. Last foreground and background color will be used. After done with the styles, chain `.apply(valueToApplyTo)` and you'll have your proper SGR string
 *
 * e.g. `style.red.blueBg.underline.apply('Hello World!');`
 *
 * #### Colors
 *
 * if the color is prefixed with a `b` it's the "bright" variant
 * if it is suffixed with a `bg` it applies to the background
 * if the color you want does not exist as a named color you can use `color`. Read more on the method itself
 *
 * #### Styles
 *
 * if it's not a color, it's a style or effect. All of the information about these styles and effects ca be found in the related link
 *
 * @link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
 */
export const style = new Styler();
export * from './styler';
