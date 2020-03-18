# Contributions

Any and all contributions are welcome! This is a decently sized project with a good scoped of functionality.

## How to Contribute

1. Create a fork of the repository
2. Clone the code to your local machine
3. Create a new branch with the feature you are working on (e.g. WebSocket-Interceptor) or with the issue number (e.g. issue/42)
4. Implement your changes, ensure tests are still passing, or add tests if it is a new feature
5. Push back to your version on GitHub
6. Raise a Pull Request to the main repository

## Local Testing

Besides unit and e2e tests, there is also the ability to just run a local NestJS application with the `OgmaModule` imported into it. This code is already setup and ready to be worked with as necessary, all you need to do is `npm run build:all` to build both the `OgmaModule` code and the NestJS application and then `npm run start:test` to start the test application. From there, you can use Postman, cURL, the Node REPL, or any other method of testing you find pleasing to use.

### Breaking apart the builds

If you need to only recompile the library code, you can use `npm run build` to build the main lib.

Similarly if you only need to rebuild the NestJS server, use `npm run build:test`.

## Issues

Please raise an issue, or discuss with me [via email](mailto:me@jaymcdoniel.dev) or [Discord](https://discordapp.com) (PerfectOrphan31#6003) before opening a Pull Request so we can see if they align with the goals of the project.
