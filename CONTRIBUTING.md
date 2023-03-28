Thanks for showing interest to contribute to GreenField JS SDK!

When it comes to open source, there are different ways you can contribute, all
of which are valuable. Here's a few guidelines that should help you as you
prepare your contribution.

## Setup the Project

The following steps will get you up and running to contribute to Chakra UI:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/bnb-chain/greenfield-js-sdk))

2. Clone your fork locally

```sh
git clone https://github.com/<your_github_username>/greenfield-js-sdk.git
cd chakra-ui
```

3. Setup all the dependencies and packages by running `pnpm install`. This
   command will install dependencies.


## Development

To improve our development process, we've set up tooling and systems. GreenField SDK uses a monorepo structure and we treat each component as an independent package
that can be consumed in isolation.

### Tooling

- [PNPM](https://pnpm.io/) to manage packages and dependencies
- [Changeset](https://github.com/changesets/changesets) for changes
  documentation, changelog generation, and release management.

### Commands

**`pnpm install`**: bootstraps the entire project, symlinks all dependencies for
cross-component development and builds all components.

**`pnpm release`**: publish changed packages.

## Think you found a bug?

Please conform to the issue template and provide a clear path to reproduction
with a code example.

## Proposing new or changed API?

Please provide thoughtful comments and some sample API code. Proposals that
don't line up with our roadmap or don't have a thoughtful explanation will be
closed.

## Making a Pull Request?

Pull requests need only the :+1: of two or more collaborators to be merged; when
the PR author is a collaborator, that counts as one.

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/ or check out the
[rules](./.commitlintrc.js).

### Steps to PR

1. Fork of the repository and clone your fork

2. Create a new branch out of the `main` branch. We follow the convention
   `[type/scope]`. For example `fix/accordion-hook` or `docs/menu-typo`. `type`
   can be either `docs`, `fix`, `feat`, `build`, or any other conventional
   commit type. `scope` is just a short id that describes the scope of work.

3. Make and commit your changes following the
   [commit convention](https://github.com/bnb-chain/greenfield-js-sdk/blob/main/CONTRIBUTING.md#commit-convention).
   As you develop, you can run `pnpm {pkg} <module> build` and
   `pnpm {pkg} <module> test` to make sure everything works as expected.

4. Run `pnpm changeset` to create a detailed description of your changes. This
   will be used to generate a changelog when we publish an update.
   [Learn more about Changeset](https://github.com/changesets/changesets/tree/main/packages/cli).
   Please note that you might have to run `git fetch origin main:master` (where
   origin will be your fork on GitHub) before `pnpm changeset` works.

> If you made minor changes like CI config, prettier, etc, you can run
> `pnpm changeset add --empty` to generate an empty changeset file to document
> your changes.

### Tests

All commits that fix bugs or add features need a test.

<!-- ## Want to write a blog post or tutorial -->

## License

By contributing your code to the GreenField JS SDK GitHub repository, you agree to
license your contribution under the GPLv3 license.
