# Contributing

## Code style

The following linters are configured to find errors and check for code style compliance:

* TSLint in `tslint.json` for TypeScript
* StyleLint in `.stylelintrc` for SCSS

Code style compliance is enfored when merging back to master. 

## Version control

### Commit messages

Commit messages are formatted according to [AngularJS commit message guidelines](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#). This enables  automatic generation of the changelog from commit messages. 

#### Commit message format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header is mandatory and the scope of the header is optional.

#### Type (required)

Must be one of the following:

* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* refactor: A code change that neither fixes a bug nor adds a feature
* perf: A code change that improves performance
* test: Adding missing tests
* chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope

The scope is the lowercase module name. It can be omitted for changes with global impact.

#### Subject (required)

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

#### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer is the place to reference issues that this commit closes.

### Branching

The branching strategy adheres to [a simplified git flow model](http://endoflineblog.com/gitflow-considered-harmful):

* master is the only eternal branch
* Release branches are branched off master and contain work aimed for the release. Release branches are named by version, e.g. `release/1.2.0`. Once the release is ready, the top of the branch is tagged with the release version and merged back into master. 
* Hotfix branches are branched off master at the specific version's release tag. Hotfix branches are named by version, e.g. `hotfix/1.2.1`. Once the hotfix is ready, the procedure is the same as for release branches.
* Task branches are branched off master and contain work aimed to complete a specific task (feature, fix, etc). Task branches are named by issue nr and description, e.g. `project-12-home-screen`  

### Merging

Feature branches are [explicitly merged](https://developer.atlassian.com/blog/2014/12/pull-request-merge-strategies-the-great-debate/#explicit-merges-aka-non-fast-forward-) back using pull requests for code review. A local history clean-up rebase before sharing a feature branch for review is absolutely encouraged.

This helps keeping information about the historical existence of a feature branch and groups together all commits part of the feature.

### Tagging

Release branches are tagged with the version number before merging. The tag is formatted according to the [npm version command](https://docs.npmjs.com/cli/version): v[VERSION>

## Versioning

Version numbers are incremented according to [Semantic Versioning](http://semver.org).

Given a version number [MAJOR].[MINOR].[PATCH], increment the:

1. MAJOR version when you make incompatible API changes,
2. MINOR version when you add functionality in a backwards-compatible manner, and
3. PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-releases are available as extensions to the [MAJOR].[MINOR].[PATCH] format:

* [MAJOR].[MINIOR].[PATCH]-beta.[NUMBER]
* [MAJOR].[MINIOR].[PATCH]-rc.[NUMBER]
