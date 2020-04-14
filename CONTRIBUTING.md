# Contributions

Any and all contributions are welcome! This is a decently sized project with a good scoped of functionality.

## How to Contribute

1. Create a fork of the repository
2. Clone the code to your local machine
3. Create a new branch with the feature you are working on (e.g. WebSocket-Interceptor) or with the issue number (e.g. issue/42)
4. Run `yarn setup`
5. Implement your changes, ensure tests are still passing, or add tests if it is a new feature
6. Push back to your version on GitHub
7. Raise a Pull Request to the main repository

## Development

We are using [lerna](https://github.com/lerna/lerna) to help manage the monorepo, to build and manage the code, it is _suggested_ to use [yarn](https://classic.yarnpkg.com/en/docs/getting-started) as it has better support for workspaces and automatic linking between the packages. If you are creating a new package inside the monorepo you can use `lerna create` and follow the wizard from there. Make sure you name the package as `@ogma/platform-<platform-name>` to follow the naming scheme of the library.

When you first clone the project, make sure you run `yarn setup` or create an npm equivalent of it to bootstrap the dependencies together. This script will run an install for all dependencies, build all the current packages, and link all the local dependencies together.

If you are adding in a new library, please also add in integration tests for the library following the examples in [integration](integration/).

To build your the project and link the dependencies together you can run `lerna run build`.

When running the integration specific applications in a non--testing context (i.e. starting them locally), make sure to `cd` into the directory, `yarn install` the dependencies, and then run `yarn build && yarn start` to compile and start the server. From there, in a separate terminal, you can use [curl](https://curl.haxx.se/) or [Postman](https://www.postman.com/), or just use the browser directly. For websocket testing, you can use the node REPL (i.e. use `node` from the terminal) and make websocket calls from there.

It will be left up to contributors to create their own `main.ts` files for working with integration servers. All tests should be running through `jest` using `yarn test:integration` otherwise.

## Commits

We are using [Conventional Commit](https://github.com/conventional-changelog/commitlint) to help keep commit messages aligned as development continues. The easiest way to get acquainted with what the commit should look like is to run `yarn commit` which will use the `git-cz` cli and walk you through the steps of committing. When asked about the scope, you can checkout the [commitlint.config](./commitlint.config.js) file and look at the `scope-enum` property. Once you've made your commit, prettier and eslint will run and ensure that the new code is up to the standards we have in place.

## Issues

Please raise an issue, or discuss with me [via email](mailto:me@jaymcdoniel.dev) or [Discord](https://discordapp.com) (PerfectOrphan31#6003) before opening a Pull Request so we can see if they align with the goals of the project.
