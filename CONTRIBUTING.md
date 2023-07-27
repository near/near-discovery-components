Thank you for your interest in contributing to the Near Blockchain Operating System's Decentralized Interface Guidelines and the Near Discovery gateway's components.  We welcome contributions from everyone.  Below are various bits of information to help you get started.  If you require additional help, please start a [Discussion](https://github.com/near/near-discovery-components/discussions).

## Next Steps

To learn more about how to setup your local environment to efficiently work on BOS components for the Near Discovery gateway, [checkout this guide](https://github.com/near/near-discovery-components#near-discovery-widgets).


If you are looking for relatively simple tasks to familiarise yourself with
component development for the Discovery Gateway, take a look at the issues labeled `good first issue`
[here](https://github.com/near/near-discovery-components/labels/good%20first%20issue).  If you see
one that looks interesting and is unassigned or has not been actively worked on
in some time, please go ahead and start working towards creating your first pull request.

If you have an idea for an enhancement to Near Discovery's components, please submit a [feature request](https://github.com/near/near-discovery-components/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)

## Pull Requests

All the contributions to `near-discovery-components` happen via Pull Requests.  Please follow the following steps when creating a PR:

1. Fork the `near-discovery-components` repository and create a new branch to do you work there.
2. The branch can contain any number of commits.  When merged, all commits will
   be squashed into a single commit.
3. Thoroughly test your changes.
4. When ready, create a pull request against the `develop` branch of `near-discovery-components`.
5. Feel free to submit draft PRs to get early feedback and to make sure you are
   on the right track.
6. The PR name should follow the template: `<type>: <name>`.  Where `type` is:
   - `fix` for bug fixes;
   - `feat` for new features;
   - `refactor` for changes that reorganize code without adding new content;
   - `doc` for changes that change documentation or comments;
   - `test` for changes that introduce new tests;
   - `chore` for grunt tasks like updating dependencies.
7. The PR should also contain a description when appropriate to provide
   additional information to help the reviewer inspect the proposed change.

## After the PR is submitted

1. When all the comments from the reviewer(s) have been addressed, the reviewer should
approve the PR.
2. An approved PR will be merged automatically into `develop`, which is continuously deployed to [test.near.org](https://test.near.org)


## Release Schedule
Changes from `develop` are promoted to the `main` branch weekly, on Thursdays.
