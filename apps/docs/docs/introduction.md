---
id: introduction
title: Introduction
slug: /
---

## Motivation

The first question you'll probably ask yourself is "Why is there another logger library?", and it's a great question to ask! Honesty, this started off as a sided project for me to learn more about Node's streams and how loggers work, so I could be better informed when it came to using a logger. However, in the process of learning and making something for academic purposes, I ended up creating a logger that had better statistics than Winston or Bunyan, close stats to Pino, and a very simple API.

## Installation

Installation is pretty simple, choose your favorite package manager and install [`@ogma/logger`](./logger). If you're working with [NestJS](https://docs.nestjs.com) you can install [`@ogma/nestjs-module`](http://localhost:3000/ogma/docs/nestjs/module) instead and `@ogma/logger` will be installed for you.

:::note Ogma is the name of the Celtic god of Wisdom and Eloquence. As I think these logs both look pretty and tell good information, I figured I would go with it. :::

## Benchmarks

So it was mentioned that Ogma beats out Winston and Bunyan and comes very close to Pino if not beating it in a few catagories. The below are the current benchmarks, but feel free to [run them yourself](https://github.com/jmcdo29/ogma)

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 355.005893ms | 4099.797733ms | 410.885866ms | 2266.010139ms |
| Ogma | 172.904867ms | 1847.369098ms | 310.955876ms | 445.961304ms |
| Pino | 116.647594ms | 4287.163808ms | 141.358471ms | 1355.486535ms |
| Winston | 380.9764ms | 5127.20654ms | 353.4015ms | 457.380278ms |

:::info

Benchmarks generated on Linux/linux x64 5.11.0-7614-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12

:::
