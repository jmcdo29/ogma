# Contributions

Any and all contributions are welcome! This is a decently sized project with a good scoped of functionality.

## How to Contribute

1. Create a fork of the repository
2. Clone the code to your local machine
3. Create a new branch with the feature you are working on (e.g. WebSocket-Interceptor) or with the issue number (e.g. issue/42)
4. Run `pnpm i`
5. Implement your changes, ensure tests are still passing, or add tests if it is a new feature
6. Create a changeset using `pnpm changeset` and follow the wizard for what packages need to be updated. [Semver](https://semver.org/) is followed
7. Push back to your version on GitHub
8. Raise a Pull Request to the main repository

## Development

We are using [Nx](https://nx.dev) as a monorepo management toolalong with [pnpm](https://pnpm.io) as the package manager of choice, [uvu](https://github.com/lukeed/uvu) as our test runner, and [changesets](https://github.com/changesets/changesets) as a version manager. The following steps should be able to walk you through updating how to update any of the code.

When you first clone the project, make sure you run `pnpm i` to install the dependencies. You can try to use `yarn` or `npm` as well, but there are no guarantees it will work the exact same with a different lockfile. If you do choose to use `yarn` or` npm`, please do no commit their lockfiles.

To add a new library, such as a specific parser for a tirid party transport, you can run `pnpm nx g @nrwl/nest:lib <post-slash-name> --publishable --importPath=@ogma/<poast-slash-name> --unitTestRunner=none`. Nx should set up a directory in the `packages/` directory with your new library. (e.g. `pnpm nx g @nrwl/nest:lib hasura --publishable --unitTestRunner=none --importPath=@ogma/hasura` would create `@ogma/hasura`).

> This will generate more than absolutely necessary, so if you'd rather copy the format in the `worksapce.json` and update the file to include your new library, while copying over files from other `packages/platform-*` directories, that is okay too. Eventually I'll have this all aligned to make it super clear and simple.

If you are adding in a new library, please also add in integration tests for the library following the examples in [integration](./integration/).

## Testing

It will be left up to contributors to create their own `main.ts` files for working with integration servers. All tests should be running through `uvu` using `yarn test:int` otherwise.

If you need to run a specific test, make sure the docker container is first running with `docker compose up -d`, and then run the specific integration file via `node -r @swc/register integration/test/<file>`

When it comes to matching log objects, the best approach is to make use of a few helper functions from the [integration/test/utils](./integration/test/utils) directory. There is a custom matcher made for log objects specifically, `toBeALogObject()` that takes in the `method`, `endpoint`, `protocol`, and `status`. This function will end up running a few checks against the passed log object and assess if it is indeed a log object from the interceptor. A good test to look at to get a feel for how this all works is [the HTTP tests](./integration/test/http.spec.ts). Take note as well of the `createTestModule()` and `getInterceptor()` functions. Do your best to follow the tests that are already created and add in the appropriate lines for the `each` methods.

## Commits

We are using [Conventional Commit](https://github.com/conventional-changelog/commitlint) to help keep commit messages aligned as development continues. The easiest way to get acquainted with what the commit should look like is to run `yarn commit` which will use the `git-cz` cli and walk you through the steps of committing. When asked about the scope, you can checkout the [commitlint.config](./commitlint.config.js) file and look at the `scope-enum` property. Once you've made your commit, prettier and eslint will run and ensure that the new code is up to the standards we have in place.

## Changesets

After you've made your changes, run `pnpm changeset` to start up the changeset wizard. Select the packages that ou've updated, either via the `Changed packages` option or individually, and then select the kind of update.

- `major` updates are for breaking changes. Often time including updating `@nestjs/` to the next major version or API chagnes that are incompatible with previous versions
- `minor` updates are for new features, like new APIs on the logger or service that don't include breaking changes to older APIs
- `patch` updates are for bug fixes, including type fixes

After selecting the type, provide a summary of the change that will be automatically added to the `CHANGELOG` for each package updated. Lastly, commit the new changeset markdown file and include it with your changes.

> Note: you can provide multiple changeset files in a single PR if you want to have more granular `CHANGELOG` messages.

The CI pipeline will take care of updating the `package.json`s accordingly, unless you're makinig a major bump and need to modify the peerDependencies of each package, but this should most likely be left to the maintainer.

## Issues

Please raise an issue, or discuss with me [via email](mailto:me+ogma@jaymcdoniel.dev) or [Discord](https://discordapp.com) (PerfectOrphan31#6003) before opening a Pull Request so we can see if they align with the goals of the project.
