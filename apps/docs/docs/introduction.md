---
id: introduction
title: Introduction
slug: /
---

## Motivation

The first question you'll probably ask yourself is "Why is there another logger library?", and it's a great question to ask! Honesty, this started off as a sided project for me to learn more about Node's streams and how loggers work, so I could be better informed when it came to using a logger. However, in the process of learning and making something for academic purposes, I ended up creating a logger that had better statistics than Winston or Bunyan, close stats to Pino, and a very simple API.

## Installation

Installation is pretty simple, choose your favorite package manager and install [`@ogma/logger`](./logger). If you're working with [NestJS](https://docs.nestjs.com) you can install [`@ogma/nestjs-module`](https://jmcdo29.github.io/ogma/docs/nestjs/module/) instead and `@ogma/logger` will be installed for you.

:::note

Ogma is the name of the Celtic god of Wisdom and Eloquence. As I think these logs both look pretty and tell good information, I figured I would go with it.

:::

## Benchmarks

So it was mentioned that Ogma beats out Winston and Bunyan and comes very close to Pino if not beating it in a few catagories. The below are the current benchmarks, but feel free to [run them yourself](https://github.com/jmcdo29/ogma)

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

| Logger    | Simple  | Long     | JSON    | Deep     |
| --------- | ------- | -------- | ------- | -------- |
| Bunyan    | 383.3ms | 4037.3ms | 411.5ms | 2000.3ms |
| Ogma      | 177.0ms | 1790.2ms | 338.0ms | 467.4ms  |
| OgmaMasks | 171.2ms | 1846.6ms | 315.1ms | 695.4ms  |
| Pino      | 126.6ms | 4056.8ms | 470.4ms | 1385.1ms |
| Winston   | 398.4ms | 4724.1ms | 337.3ms | 462.8ms  |

:::info

Benchmarks generated on Linux/linux x64 5.11.0-7620-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 1

:::
