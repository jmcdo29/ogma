---
id: overview
title: RPC Overview
layout: ../../../../layouts/MainLayout.astro
---

Ogma also has parsers for every [built in transport](https://docs.nestjs.com/microservices/basics) that Nest has. Something important to note is that due to how microservices work, at least with Nest, to get the client IP of each request, it needs to be added to the payload sent by the client. [If anyone has a way to manage this more cleanly, a pull request is always appreciated](https://github.com/jmcdo29/ogma/compare). [You can find more information here](https://stackoverflow.com/questions/45235080/how-to-know-the-ip-address-of-mqtt-client-in-node-js).

```
[2021-09-06T18:50:28.351Z] [INFO]  [jay-pop] [REDIS] [138626] [1630954228350937] [RpcServerController#getMessage] 127.0.0.1 - REDIS {"cmd":"message"} redis 200 1ms - 17
```
