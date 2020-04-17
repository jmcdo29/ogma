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

## Testing

It will be left up to contributors to create their own `main.ts` files for working with integration servers. All tests should be running through `jest` using `yarn test:int` otherwise.

If you need to run tests for a specific context, use `yarn test:int <context>` (one of: http, ws, gql, rpc) e.g. `yarn test:int http` will run the integration tests for the Express and Fastify parsers.

When it comes to matching log objects, the best approach is to make use of a few helper functions from the [integration/test/utils](./integration/test/utils) directory. There is a custom matcher made for log objects specifically, `toBeALogObject()` that takes in the `method`, `endpoint`, `protocol`, and `status`. This function will end up running a few checks against the passed log object and assess if it is indeed a log object from the interceptor. A good test to look at to get a feel for how this all works is [the HTTP tests](./integration/test/http.spec.ts). Take note as well of the `createTestModule()` and `getInterceptor()` functions. Do your best to follow the tests that are already created and add in the appropriate lines for the `each` methods.

## Commits

We are using [Conventional Commit](https://github.com/conventional-changelog/commitlint) to help keep commit messages aligned as development continues. The easiest way to get acquainted with what the commit should look like is to run `yarn commit` which will use the `git-cz` cli and walk you through the steps of committing. When asked about the scope, you can checkout the [commitlint.config](./commitlint.config.js) file and look at the `scope-enum` property. Once you've made your commit, prettier and eslint will run and ensure that the new code is up to the standards we have in place.

## Issues

Please raise an issue, or discuss with me [via email](mailto:me@jaymcdoniel.dev) or [Discord](https://discordapp.com) (PerfectOrphan31#6003) before opening a Pull Request so we can see if they align with the goals of the project.
