---
id: cli
title: CLI
---

# @ogma/cli

Rehydration of Ogma JSON logs without a problem.

Ogma comes with a command line function to rehydrate your json formatted logs back into the human readable format that can be installed with `@ogma/cli`. The command takes one to two arguments, a log file relative to where the command is run from, and an optional flag to force the cli to print out with color. Find the table below to learn more about the arguments.

| argument | required | default | description |
| --- | --- | --- | --- |
| file | yes | none | The log file to be "hydrated". This file should contain newline separated Ogma formatted JSON logs. |
| --color | no | terminal's TTY argument | you can pass `--color` or `--color=true` to force colors to be used. `--color=false` will force the command to not print the logs back out in color. Depending on the terminal you are using, colors may not be used by default. |

The arguments can be passed in any order for ease of use.

## Example

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

## Demo

<div align="center">
  <img src="https://ogma-docs-images.s3-us-west-2.amazonaws.com/ogma-cli.gif" alt="Ogma CLI gif" width="1200"/>
</div>
