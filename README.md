# Near Discovery Components

This is a repository that holds the source code of all NEAR discovery components that the team maintains for [near.org](https://near.org).

Components will be deployed to production automatically as they are merged into the main branch. This occurs weekly, on Thursdays.

Keep in mind that folders under `src` will be prepended to the component name when it's deployed. E.g. `src/post/comment.jsx` will be deployed as `post.comment`.


### Deployments Across Discovery Gateways
#### tl;dr;
>test.beta.near.org => discom-dev.testnet

>test.near.org => discom.testnet

>near.org => near TLA

>beta.near.org => near TLA

The [discovery gateway](https://github.com/near/near-discovery) deploys its main and develop branches across environments as follows
- the `main` branch is deployed on [near.org](https://near.org), pointing to `mainnet` and [test.near.org](https://test.near.org) pointing to `testnet`
- the `develop` branch is deployed to [beta.near.org](https://beta.near.org), pointing to `mainnet`, and [test.beta.near.org](https://test.beta.near.org), pointing to `testnet`

This `discovery-components` repo deploys main and develop branches across accounts as follows
- the `main` branch deploys components to the near top-level-acount for `mainnet` and `discom.testnet` for `testnet` except where indicated otherwise in replacements.[mainnet/testnet].json
- the `develop` branch deploys components to `discom-dev.testnet` except where indicated otherwise in replacements.dev.json; there is currently no mainnet deployment for the develop branch.


## Contributing

Please review the [contribution guide](CONTRIBUTING.md)

## Local Development

Please review the [Local development with BOS-Loader](CONTRIBUTING.md#local-development-with-bos-loader)

*Note:* This repository is not compatible with the [VS Code Extension](https://docs.near.org/bos/dev/vscode) due to the [replacements](CONTRIBUTING.md#testing-across-multiple-environments) strategy featured in this repository.

## Troubleshooting Deployments

`near-social` cli tool will attempt to deploy any updated components with 1 NEAR of deposit and 100 Tgas.

The deployment may fail if too many changes are present. There are several solutions for this. You can either plan releases more often or release components in batches from your local using `near-social`.

If you get a `Not enough storage balance` error, you will need to make sure that the NEAR account has enough storage staked on the `social.near` contract. You can view the current storage and available storage for any account using `near-cli-rs`:

`near-cli contract call-function as-read-only social.near storage_balance_of json-args '{"account_id":"adminalpha.near"}' network-config mainnet now`

Note: replace `adminalpha.near` with any other account name on mainnet.

You can then stake more of your NEAR for storage on `social.near` using `near-cli-rs`:

`near-cli contract call-function as-transaction social.near storage_deposit json-args {} prepaid-gas '100.000 TeraGas' attached-deposit '0.5 NEAR' sign-as adminalpha.near network-config mainnet sign-with-seed-phrase '{{REPLACE_WITH_SEED_PHRASE}}' --seed-phrase-hd-path 'm/44'\''/397'\''/0'\'''`
