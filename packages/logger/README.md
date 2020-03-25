<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_ogma) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Actions Status](https://github.com/jmcdo29/ogma/workflows/CI/badge.svg)](https://github.com/jmcdo29/ogma/workflows/CI/badge.svg) [![Version](https://badgen.net/npm/v/ogma)](https://npmjs.com/package/ogma) [![Coffee](https://badgen.net/badge/Buy%20Me/A%20Coffee/purple?icon=kofi)](https://www.buymeacoffee.com/jmcdo29)

</div>

# Ogma

Beautifully simple logging.

## Why

Really just because I wanted to. Feel free to use whatever logger you want, [Winston](https://www.npmjs.com/package/winston), [pino](https://www.npmjs.com/package/pino), [bunyan](https://www.npmjs.com/package/bunyan), or anything else. This is just how I wanted my logs to look.

## Okay, but why Ogma?

Name of the Celtic god of Wisdom and Eloquence. As I think these logs both look pretty and tell good information, I figured I would go with the name

## Use

### Logging

To use Ogma, first you'll need to instantiate an instance of the Ogma class. You can pass in options to override the default if you would like as well. (options defined below). Ogma has eight different logging levels:

- OFF: No logs are displayed through Ogma. `console.log` will still work
- SILLY: For when you just want to type fun stuff but don't really want people to see it (usually). Colored with Magenta
- VERBOSE: great for long strings of errors and things going on. Colored with Green
- DEBUG: Just like the name implies, debugging! Colored with Blue
- INFO: For normal logging, nothing special here. Colored with Cyan.
- WARN: For errors about things that _may_ be a problem. Colored with Yellow.
- ERROR: For errors about things that _are_ a problem. Colored with Red.
- FATAL: Yeah, you should call someone at 3AM if this log ever shows up. Colored with Red.

When discussing log levels, Ogma will print at the level provided and anything under the level as shown above, so if 'SILLY' is set, all logs will be show; if 'WARN' is set as the logLevel, only 'WARN', 'ERROR', and 'FATAL' logs will be shown. The only exclusion to this rule if 'OFF', which prints nothing through Ogma.

When colors are enabled, the color mentioned above will be the color the level string is printed in.

There is also the `printError` method on the `Ogma` class thta takes care of printing the error's name under the ERROR level, the message under the WARN level, and the stack trace under the VERBOSE level.

> Note: INFO is also aliased as LOG so `ogma.log()` works just like `ogma.info()`, but the log level will stay as "INFO" in both cases. The same goes for "VERBOSE" and "FINE" with "FINE" being the log level printed (for the sake of being concise). Lastly, 'ALL' can be used for all logs. This is the same as setting `logLevel` to 'SILLY'.

#### Adding Context and Application Name

If for tracing purposes you'd like to add a context to the log, or an application name, you can pass the context to the method related to the logLevel (such as `ogma.debug('debug message, SomeClass.name, 'NestJS')` and Ogma will print

```sh
[2019-12-19T23:01:23.900Z] [NestJS] 34760 [SomeClass] [Debug]| debug message
```

> Note: If colors are enabled, application will print in Yellow and context will print in Cyan.

When application and context are both present, Ogma will print your logs in a form as follows

```sh
[ISOString Date] [Application] PID [Context] [LogLevel]| message
```

Examples can be seen below. The JSON structure follows the same form with log level and message being the last two properties.

#### Ogma Options

| name | type | use |
| --- | --- | --- |
| logLevel | one of the above log levels (default: INFO) | for determining this instance of Ogma's log level |
| color | boolean (default: true) | determine if color should attempt to be used. NOTE: Color will not be used if the current terminal does not support it |
| stream | NodeJS.WriteStream OR NodeJS.WritableStream (default: process.stdout) | the output mechanism used to know how to write logs |
| json | boolean (default: false) | print the logs in a JSON format |
| context | string optional | a context for the Ogma class to work with. |
| application | string optional | an application name for Ogma to print |

#### Using Files instead of a console

> Note: Ogma will try to use colors if they are available, but will otherwise ignore the color option if `stream.hasColors()` return false.

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

#### JSON Logging

If the `json` option is passed as `true` then regardless of `color` Ogma will print your message along with system information in a single line JSON object (i.e. no newline characters). View the sample below to get a better idea of Ogma's output.

> Note: if you log an object, the `message` property will be removed and the object will be a part of the raw JSON format. If you want the object to show up under the `message` property, you can add `JSON.stringify(obj).replace(/\"/g, '')`. Just be aware that circular objects will still be problematic unless you add a circular replacer.

### Applying color to Text

No console logging package is complete without color, and because of that `Ogma` exports some utility methods for wrapping text in color, so long as your terminal of choice supports 3/4-bit color. You can find the the color reference in the screenshot below.

To make use of the utility functions you'll need to import the `color` method and pass in your string to the desired color like so:

```ts
import { color } from '@ogma/logger';

color.blue('This will be blue');
// returns '\u001b[34mThis will be blue\u001b[0m'
```

This will wrap the string `"This will be blue"` in the expected escape sequence and color value as well as reset the color afterwards so no other strings are affected.

### Example of what the logs look like

I said the logs were beautiful, and to me they absolutely are. Each log is matched with a timestamp in ISO format, the log level, a pipe character, and then the message, for easier searching if needed. If a JSON is passed to Ogma, a new line will separate the JSON and the original log line, but the timestamp and level will not be duplicated. Ogma also will print `'[Function]'` if a function is found or `'[Circular]'` is a circular reference is found.

```shell
# ogma.log('hello')
[2019-12-11T22:54:58.462Z] 34760 [INFO] | hello

# ogma.log({a: () => 'hello', b: {c: 'nested'}, d: this});
[2019-12-11T22:56:02.502Z] 34760 [INFO] |
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

### Example from Command Line

![](Ogma-log.png)

![](Ogma-log-json.png)

## Command Line Function

Ogma comes with a built in command line function to rehydrate your json formatted logs back into the human readable format. The command takes one to two arguments, a log file relative to wear the command is run from, and an optional flag to force the cli to print out with color. Find the table below to learn more about the arguments.

| argument | required | default | description |
| --- | --- | --- | --- |
| file | yes | none | The log file to be "hydrated". This file should contain newline separated Ogma formatted JSON logs. |
| --color | no | terminal's TTY argument | you can pass `--color` or `--color=true` to force colors to be used. `--color=false` will force the command to not print the logs back out in color. Depending on the terminal you are using, colors may not be used by default. |

The arguments can be passed in any order for ease of use.

### Example

An example of the command's usage could be like so:

```sh
ogma production.log --color
```

or if you have a TTY enabled command prompt

```sh
ogma production.log
```

As this prints out to `process.stdout` it is possible to pipe this output to another file using the `>` operator. Like so:

```sh
ogma production.log > production.hydrated.log
```

## Benchmarks

While Ogma may not boast as being as fast as pino, it is still quick with what it does. You can check out some of the [benchmarks here](./benchmark/benchmark.md).
