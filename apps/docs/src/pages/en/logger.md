---
id: logger
title: Logger
layout: ../../layouts/MainLayout.astro
---

## Logging

To use Ogma, first you'll need to instantiate an instance of the Ogma class. You can pass in options to override the default if you would like as well. (options defined below). Ogma has eight different logging levels:

- OFF: No logs are displayed through Ogma. `console.log` will still work
- SILLY: For when you just want to type fun stuff but don't really want people to see it (usually). Colored with Magenta
- VERBOSE: great for long strings of errors and things going on. Colored with Green
- DEBUG: Just like the name implies, debugging! Colored with Blue
- INFO: For normal logging, nothing special here. Colored with Cyan.
- WARN: For errors about things that _may_ be a problem. Colored with Yellow.
- ERROR: For errors about things that _are_ a problem. Colored with Red.
- FATAL: Yeah, you should call someone at 3AM if this log ever shows up. Colored with Red.

When discussing log levels, Ogma will print at the level provided and anything under the level as shown above, so if 'SILLY' is set, all logs will be shown; if 'WARN' is set as the logLevel, only 'WARN', 'ERROR', and 'FATAL' logs will be shown. The only exclusion to this rule is 'OFF', which prints nothing through Ogma.

When colors are enabled, the color mentioned above will be the color the level string is printed in.

:::note

INFO is also aliased as LOG so `ogma.log()` works just like `ogma.info()`, but the log level will stay as "INFO" in both cases. The same goes for "VERBOSE" and "FINE" with "FINE" being the log level printed (for the sake of being concise). Lastly, 'ALL' can be used for all logs. This is the same as setting `logLevel` to 'SILLY'.

:::

### printError

There is also the `printError` method on the `Ogma` class that takes care of printing the error's name under the `ERROR` level, the message under the `WARN` level, and the stack trace under the `VERBOSE` level.

## Adding Context and Application Name

If for tracing purposes you'd like to add a context to the log, or an application name, you can pass the context to the method related to the logLevel (such as `ogma.debug('debug message, { context: SomeClass.name, application: 'NestJS' })` and Ogma will print

```sh
[2019-12-19T23:01:23.900Z] [DEBUG] [hostname] [NestJS] 34760 [SomeClass] debug message
```

:::info

If colors are enabled, hostname will print in magenta application will print in Yellow and context will print in Cyan.

:::

When application and context are both present, Ogma will print your logs in a form as follows

```sh
[ISOString Date] [logLevel] [hostname] [Application] PID [Context] message
```

Examples can be seen below. The JSON structure follows the same form with log level and message being the last two properties.

## Printing Multiple Values

To get `ogma` to automatically print multiple values for you, rather than having to call `ogma.log` on each value, you can pass an array of value and the `{ each: true }` option to `ogma`. This will cause `ogma` to print each value of the array as if you had called `ogma.log` on each one.

:::info

Ogma ill **not** recursively print arrays of arrays. `[ ['Hello', 'World'], ['Foo', 'Bar', 'Baz']` will print two arrays across two lines, not five strings across five lines.

:::

:::info

This option is available in `@ogma/logger@^2.4.0`

:::

This option is also available globally, so you can set it on the instantiation of your ogma instance and no worry about it on each call.

:::info

This option is available in `@ogma/logger@^2.5.0`

:::

## Ogma Options

| name | type | use |
| --- | --- | --- |
| logLevel | one of the above log levels (default: INFO) | for determining this instance of Ogma's log level |
| color | boolean (default: true) | determine if color should attempt to be used. NOTE: Ogma only does not use color if there is an explicit `getColorDepth` of 1 or `NO_COLOR` or `NODE_DISABLE_COLOR` is set |
| stream | { write: (message: any) => void, getColorDepth?: () => number } | the output mechanism used to know how to write logs |
| json | boolean (default: false) | print the logs in a JSON format |
| context | string optional | a context for the Ogma class to work with. |
| application | string optional | an application name for Ogma to print |
| levelMap | an object with the above levels as the keys and strings as the vales | a way to provide custom log levels in the event that there are mappings the developer wants to support |
| levelKey | string optional | A specific key to print the level as when in JSON mode. Useful for things like GCP which use `severity` instead of `level` |
| masks | string[] | An array of words that should be replaced while logging. useful for sensitive information like passwords. |
| logPid | boolean | An optional property you can set if you don't want to log the PID. |
| logApplication | boolean | An optional property you can set if you don't want to the the application name. |
| logHostname | boolean | An optional property you can set if you don't want to log the hostname of the machine you're on. |
| each | boolean | An optional property that determines if array values should be printed on separate lines by default or not |
| mixin | function | A utility to add dynamic data to each log. Takes in the log level and the ogma instance and returns an object |

:::note

Using `masks` can lead to some performance degradations, due to the need to determine what values to block.

:::

### Using Files instead of a console

:::note

Ogma will try to use colors if they are available, and by default will do so. If the current `stream` has a `getColorDepth` method, that will be used to determine the color's possible outputs. If you want to override this, to force colors you can use the [`FORCE_COLOR` env variable (0,1,2,3)](https://nodejs.org/api/tty.html#tty_writestream_getcolordepth_env) or to disable them you can use the [`NO_COLOR` or `NODE_DISABLE_COLOR` env variable](https://nodejs.org/api/tty.html#tty_writestream_getcolordepth_env).

:::

If you want to use a file to hold your logs instead of a console/terminal/bash you can pass in a stream of your own to the options like so:

```ts
import { createWriteStream } from 'fs';
import { Ogma } from '@ogma/logger';

const fileWriter = new Ogma({
  stream: createWriteStream('./server.log')
  }
});

fileWriter.log('Logging to File');
```

### JSON Logging

If the `json` option is passed as `true` then regardless of `color` Ogma will print your message along with system information in a single line JSON object (i.e. no newline characters). View the sample below to get a better idea of Ogma's output. Ogma will add an `ool` property to the JSON logs or `Ogma Original Level`. This is in case there is a custom levelMap passed and allows the CLI to still transform the output back into Ogma's standard format.

### Applying color to Text

As of version 2, it is suggested to use the separate [`@ogma/styler`](/en/styler) package. This package is what Ogma uses under the hood to do the basic coloring, and will provide a cleaner and more verbose API.

Using the non-JSON mode, color is attempted to be applied by default. This is determined by checking the current environment (if there is a global `process` variable) and if there is, what `stdout.getColorDepth()` returns. If a custom stream is passed instead, a `getColorDepth` method can be added to the stream object which should return a 1, 4, 8, or 24. If no `getColorDepth()` is present, but the `color` option is true, Ogma will set the method to return `4` for you. If you want to disable colors completely, you can either set `color` to be `false` or you can set the `NO_COLOR` environment variable.

### Using a Mixin

There may be times, like with [OpenTelemetry](https://opentelemetry.io) or with adding a correlation id, that you need to add dynamic values to each log. Rather than making a new wrapper around the Ogma instance, Ogma provides an optional `mixin` property that can be used to add extra data to each log without being in `verbose` mode. This property is a function, that takes in the current log level and the Ogma instance, and should return an object of any shape.

### Child Loggers

There may be times where you have a default logging configuration that you want to use across multiple a project without having to save the configuration to a variable. If that ever becomes the case, you can call `ogma.child()` and pass in a partial object of new options which will merge with the original options passed to the first `new Ogma()` call. This will return a new logger instance that will have the combined options, so you can change things like the log level or the context easily, without having to create new `levelMap` or `masks`.

## Example of what the logs look like

I said the logs were beautiful, and to me they absolutely are. Each log is matched with a timestamp in ISO format, the log level, a pipe character, and then the message, for easier searching if needed. If a JSON is passed to Ogma, a new line will separate the JSON and the original log line, but the timestamp and level will not be duplicated. Ogma also will print `'[Function]'` if a function is found or `'[Circular]'` is a circular reference is found.

```shell
# ogma.log('hello')
[2019-12-11T22:54:58.462Z] [INFO]  [hostname] 34760 hello

# ogma.log({a: () => 'hello', b: {c: 'nested'}, d: this});
[2019-12-11T22:56:02.502Z] [INFO]  [hostname] 34760
{
  "a": "[Function]",
  "b": {
    "c": "nested"
  },
  "d": {
    "global": "[Circular]",
    "clearInterval": "[Function]",
    "clearTimeout": "[Function]",
    "setInterval": "[Function]",
    "setTimeout": "[Function]",
    "queueMicrotask": "[Function]",
    "clearImmediate": "[Function]",
    "setImmediate": "[Function]",
    "__extends": "[Function]",
    "__assign": "[Function]",
    "__rest": "[Function]",
    "__decorate": "[Function]",
    "__param": "[Function]",
    "__metadata": "[Function]",
    "__awaiter": "[Function]",
    "__generator": "[Function]",
    "__exportStar": "[Function]",
    "__values": "[Function]",
    "__read": "[Function]",
    "__spread": "[Function]",
    "__spreadArrays": "[Function]",
    "__await": "[Function]",
    "__asyncGenerator": "[Function]",
    "__asyncDelegator": "[Function]",
    "__asyncValues": "[Function]",
    "__makeTemplateObject": "[Function]",
    "__importStar": "[Function]",
    "__importDefault": "[Function]"
  }
}
```

#### Standard String Logging

<div align="center">
  <img src="https://ogma-docs-images.s3-us-west-2.amazonaws.com/ogma-demo.gif" alt="Ogma String Logging" width="1200"/>
</div>

#### JSON Logging

<div align="center">
  <img src="https://ogma-docs-images.s3-us-west-2.amazonaws.com/ogma-json-demo.gif" alt="Ogma JSON Logging" width="1200"/>
</div>
