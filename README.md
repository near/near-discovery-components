# Near Discovery Widgets

This is a repository that holds the source code of all NEAR discovery widgets that the team maintains for [near.org]().

Widgets will be deployed to production automatically as they are merged into the main branch.

Keep in mind that folders under `src` will be prepended to the widget name when it's deployed. E.g. `src/post/comment.jsx` will be deployed as `post.comment`.

This repository is not compatible with the [VS Code Extension](https://docs.near.org/bos/dev/vscode) due to the replacements strategy featured in this repository.

# Contributing

Please create feature branches off of develop.

When referencing another widget or any parameter that depends on the network, please use the placeholders defined in `replacements.*.json`. There are three such files that correspond to different environments:

* `replacements.dev.json` - dev testnet

* `replacements.testnet.json` - prod testnet

* `replacements.mainnet.json` - prod mainnet


Placeholders should be encapsulated in the `${}` expression. Here is an example of a placeholder usage:

`<Widget src={homepage ?? "${REPL_ACCOUNT}/widget/ActivityPage"} />;`

Placeholders are replaced with the target values specified in replacements.json during the deployment of widgets.

Feel free to specify a new placeholder if needed. The placeholder should have a `REPL` prefix, for example:

`REPL_SOME_URL`

A new placeholder should be defined for all three environments: dev-testnet, prod-testnet and prod-mainnet.

PRs merged into develop are deployed to a testnet environment as widgets are updated. 

When a production deployment is ready, develop should be merged into main which will automatically deploy widgets to production.

Use [bos-loader](https://github.com/near/near-discovery#local-component-development) to faciliate testing the appearance and behavior of your components from a locally running viewer, or near.org. 

# Troubleshooting Deployments

`near-social` cli tool will attempt to deploy any updated widgets with 1 NEAR of deposit and 100 Tgas.

The deployment may fail if too many changes are present. There are several solutions for this. You can either plan releases more often or release widgets in batches from your local using `near-social`.

If you get a `Not enough storage balance` error, you will need to make sure that the NEAR account has enough storage staked on the `social.near` contract. You can view the current storage and available storage for any account using `near-cli-rs`:

`near-cli contract call-function as-read-only social.near storage_balance_of json-args '{"account_id":"adminalpha.near"}' network-config mainnet now`

Note: replace `adminalpha.near` with any other account name on mainnet.

You can then stake more of your NEAR for storage on `social.near` using `near-cli-rs`:

`near-cli contract call-function as-transaction social.near storage_deposit json-args {} prepaid-gas '100.000 TeraGas' attached-deposit '0.5 NEAR' sign-as adminalpha.near network-config mainnet sign-with-seed-phrase '{{REPLACE_WITH_SEED_PHRASE}}' --seed-phrase-hd-path 'm/44'\''/397'\''/0'\'''`
