# `@ogma/styler`

String formatting, made easy.

## Why Not [Chalk](https://github.com/chalk/chalk)?

Mostly this package was created for academic purposes and better understanding terminal [SGRs](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR), but I also like to know the code I'm using and how it works. Chalk is great, but the use of chaining _or_ using the property as a method is a bit strange to me. With `@ogma/styler` I was able to use `getter`s for option chaining, a `const enum` for all the SGR values, and a single method for finalizing the application to the string that is being styled.

With all that said, if you like Chalk, use Chalk. It's a great trusted package.

## Use

To use this package, simply install it

```sh
pnpm i @ogma/styler
yarn add @ogma/styler
npm i @ogma/styler
```

and import the `style` instance from the package

```ts
import { style } from '@ogma/styler';
```

And now you can chain options for your string, just make sure to `apply` to the string (or primitive) you want to style.

```ts
console.log(style.blue.yellowBg.underline.apply('Hello World!'));
// prints \x1B[34m\x1B[43m\x1B[4mHello World!\x1B[0m
```

![blue-yellow-bg-underline](https://ogma-docs-images.s3-us-west-2.amazonaws.com/blue-yellowbg-underline.png)

## What styles are available?

Most of the [values on the SGR list](<https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters>) are available to use. `underline`, `italic`, `bold,` `double-underline`, `blink`, and `color` to name a few.

## Turning Off Styling

### Colors Only

If you'd like to turn off colors only you can do one of a few things.

1. pass in a `stream` to `style.child()` that has a `getColorDepth` property that is a function that returns the value `1`.
2. Set the `NO_COLOR` or `NODE_DISABLE_COLOR` environment variables to any value. So long as `process.env.NO_COLOR` is truthy, colors will be disabled
3. Set the `FORCE_COLOR` environment variable to `1`.

### All Styling

If you want no styling in your production environment you can set the `NO_STYLE` environment variable to anything that will result in a `truthy` check.
