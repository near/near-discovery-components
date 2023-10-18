Thank you for your interest in contributing to the Near Blockchain Operating System's Decentralized Interface Guidelines and the Near Discovery gateway's components.  We welcome contributions from everyone.  Below are various bits of information to help you get started.  If you require additional help, please start a [Discussion](https://github.com/near/near-discovery-components/discussions).

## Next Steps

To learn more about how to setup your local environment to efficiently work on BOS components for the Near Discovery gateway, [checkout this guide](https://github.com/near/near-discovery-components#near-discovery-widgets).


If you are looking for relatively simple tasks to familiarise yourself with
component development for the Discovery Gateway, take a look at the issues labeled `good first issue`
[here](https://github.com/near/near-discovery-components/labels/good%20first%20issue).  If you see
one that looks interesting and is unassigned or has not been actively worked on
in some time, please go ahead and start working towards creating your first pull request.

If you have an idea for an enhancement to Near Discovery's components, please submit a [feature request](https://github.com/near/near-discovery-components/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)


## Testing across multiple environments
When referencing a component or any parameter that depends on the network, please use the placeholders defined in `replacements.*.json`. There are three such files that correspond to different environments:

`replacements.dev.json` - deploys the develop branch, to testnet @ test.beta.near.org

`replacements.testnet.json` - deploys main branch, to testnet @ test.near.org

`replacements.mainnet.json` - deploys main branch to mainnet @ near.org

Placeholders should be encapsulated in the `${}` expression. Here is an example of a placeholder usage:

`<Widget src={homepage ?? "${REPL_ACCOUNT}/widget/ActivityPage"} />`
or
`<Widget src="${REPL_ACCOUNT}/widget/DIG.Button" />`

Placeholders are replaced with the target values specified in `replacements.*.json` when github actions deploys the components.

Feel free to specify a new placeholder if needed. The placeholder should have a `REPL_` prefix, for example: `REPL_PROJECT_NAME`

A new placeholder should be defined for all three environments: dev-testnet, prod-testnet and prod-mainnet.

## Local development with BOS-Loader
Use [bos-loader](https://github.com/near/bos-loader) > `0.7.0` to faciliate testing the appearance and behavior of your components from a locally running viewer, or [near.org](https://near.org).

### Heads up!
One trick when using [bos-loader](https://github.com/near/bos-loader) with this `near-discovery-components` repository:
1. Open one of `replacements.*.json` depending on what environment you are about to start working on. Try to use `replacements.testnet.json` if you're not sure.
2. Delete the `REPL_ACCOUNT` line. This step is needed because you need to specify a `REPL_ACCOUNT` value when launching the `bos-loader`.
3. Open `near-discovery-components` in your terminal.
4. Navigate to `src` directory.
5. Run this command:
```bash
bos-loader -r ../replacements.<working-env>.json <account-name>
```

*Don't forget to specify your working environment and account name!*

If you did everything right you have to see such message in your terminal:

```
Serving .jsx files on http://127.0.0.1:3030

. as account <account-name>
```

6. Open the `/flags` route of your gateway and set the BOS Loader URL e.g. `http://127.0.0.1:3030`.
   If you are not testing changes to gateway code, then you can use `near.org` as your gateway. In this case you would navigate to `near.org/flags` and set the BOS Loader URL to `http://127.0.0.1:3030`.

*Note:* there is no hot reload, you must refresh the page to see component changes.

#### Do not commit `replacements.*.json` changes unless you have added a new `REPL_` variable

### Example:

```bash
bos-loader -r ../replacements.testnet.json discom.testnet
```

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
