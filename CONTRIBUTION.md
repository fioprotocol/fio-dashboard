# Contribution Guidelines

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

All pull requests MUST be submitted to the [Github](https://github.com/ezetech/generator-ezetech) repository.

## Branch naming standards

We have protected branches `master` for stable code and `develop` for current sprint development. At the sprint end `develop` SHOULD be merge to `master`.
In case if we need to merge only few features from develop need to create `release` branch from `master` and cherry-pick needed commits to this branch and merge it to `master`.

Each feature SHOULD has its own branch what checkouts from `develop`.

Branch names SHOULD start with JIRA ticket number. Example: `EZE-5-contribution-file`.

It's RECOMMENDED to rebase your branch to `develop`/`master` before open pull request.

It's RECOMMENDED to squash commits before merge.

It's RECOMMENDED to remove branch after merge.

## Commit message

Git history SHOULD be kept as clean as possible.

We SHOULD use JIRA ticket number in a commit. Example: `EZE-5. Create CONTRIBUTION.md file`

We MUST use imperative mood for commit messages. And it SHOULD describe what and why does this commit. For more details look [here](http://chris.beams.io/posts/git-commit/)

## Git hooks

We use [pre-commit package](https://www.npmjs.com/package/pre-commit) for managment pre-commit [git hooks](https://git-scm.com/docs/githooks).
This helps a developer remember run tests, check code-style and etc. It's NOT RECOMMENDED to skip hooks `git commit -n` command.

## Versioning

App version MUST be compatible with [Semantic Versioning](http://semver.org/)

## Coding standards

TBD

## Code analysis

TBD

## Tests

TBD
