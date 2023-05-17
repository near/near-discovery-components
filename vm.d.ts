/**
 * VM provides a convenient API to update the state of the component.
 * More info {@link https://docs.near.org/bos/api/state#state-apis}
 */
declare namespace State {
  /**
   * `State.init` takes an object as an argument and initializes the state of the component with this object. It'll be no-op if the state is already initialized.
   * More info {@link https://docs.near.org/bos/api/state#stateinit}
   * @param state an initial state object for the component.
   */
  function init(state: object): void;

  /**
   * The `State.update` will trigger the state update, and the component will be re-rendered. It also has an optional argument, the object that will be added to the `state` object using `Object.assign`. The state will be initialized with the given object if it's not initialized yet.
   * More info {@link https://docs.near.org/bos/api/state#stateupdate}
   * @param state the state.
   * @param init an optional initial state object.
   */
  function update(state: object, init?: object): void;
}
type BlockIdentity = 'final' | number;
type SocialReturnType = 'History' | 'True' | 'BlockHeight';
type NetworkId = 'mainnet' | 'testnet'
/**
 * @param subscribe (optional) if true, the data will be refreshed every 5 seconds.
 * @param return_deleted (optional) whether to return deleted values (as `null`). Default is `false`.
*/
interface SocialGetOptions {
  subscribe?: boolean;
  return_deleted?: boolean;
}

/**
 * @param subscribe (optional) if `true`, the data will be refreshed every 5 seconds.
 * @param return_type (optional) either `"History"`, `"True"`, or `"BlockHeight"`. If not specified, it will return the `"True"`.
 * @param return_deleted (optional) whether to return deleted values (as `null`). Default is `false`.
 * @param values_only (optional) whether to return only values (don't include objects). Default is `false`.
 */
type SocialKeysOptions = SocialGetOptions & {
  return_type?: SocialReturnType;
  values_only?: boolean;
}

/**
 * @param subscribe (optional) if `true`, the data will be refreshed every 5 seconds.
 * @param accountId (optional) If given, it should either be a string or an array of account IDs to filter values by them. Otherwise, not filters by account Id.
 * @param order (optional) Either `asc` or `desc`. Defaults to `asc`.
 * @param limit (optional) Defaults to `100`. The number of values to return. Index may return more than index values, if the last elements have the same block height.
 * @param from (optional) Defaults to `0` or `Max` depending on order.
 */
interface SocialIndexOptions {
  subscribe?: boolean;
  accountId?: string | string[];
  order?: 'asc' | 'desc';
  limit?: number;
  from?: number | 'Max';
}

/**
 * @param force (optional) whether to overwrite the data.
 * @param onCommit (optional) function to trigger on successful commit. Will pass the data that was written (including `accountID`).
 * @param onCancel (optional) function to trigger if the user cancels the commit.
 */
interface SocialSetOptions {
  force?: boolean;
  onCommit?: VoidFunction;
  onCancel?: VoidFunction;
}

declare namespace Social {
  /**
   * `Social.get` fetches the data from the SocialDB contract by calling get and returns the data. While the data is fetching the returned value equals to `null`.
   * More info: {@link https://docs.near.org/bos/api/social#socialget}
   * @param patterns the path pattern(s);
   * @param finality (optional) the block height or finality;
   * @param options (optional) the {@link SocialGetOptions | options} object;
   */
  function get(patterns: string | string[], finality?: BlockIdentity, options?: SocialGetOptions): void;

  /**
   * `Social.getr` is just a wrapper helper for {@link Social.get}, it appends `**` to each of the path pattern.
   * More info: {@link https://docs.near.org/bos/api/social#socialgetr}
   * @param patterns the path pattern(s);
   * @param finality (optional) the block height or finality;
   * @param options (optional) the {@link SocialGetOptions | options} object;
   */
  function getr(patterns: string | string[], finality?: BlockIdentity, options?: SocialGetOptions): void;

  /**
   * It calls the SocialDB's `keys` API and returns the data. While the data is fetching the returned value equals to `null`. The keys contract doesn't unwrap the object, so the returned data is the same as the SocialDB's `keys` API.
   * More info: {@link https://docs.near.org/bos/api/social#socialkeys}
   * @param patterns the path pattern(s);
   * @param finality (optional) the block height or finality;
   * @param options (optional) the {@link SocialGetOptions | options} object;
   */
  function keys(patterns: string | string[], finality?: BlockIdentity, options?: SocialKeysOptions): void;

  /**
   * Returns the array of matched indexed values. Ordered by `blockHeight`.
   * More info: {@link https://docs.near.org/bos/api/social#socialindex}
   * @param action is the `index_type` from the standard, e.g. in the path `index/like` the action is `like`.
   * @param key is the inner indexed value from the standard.
   * @param options the {@link SocialIndexOptions | options} object.
   */
  function index(action: string, key: string, options?: SocialIndexOptions): void;

  /**
   * Takes a `data` object and commits it to SocialDB. It works similarly to the `CommitButton` by spawning the modal window prompt to save data, but it doesn't have to be triggered through the commit button component. It allows you to write more flexible code that relies on async promises and use other events and components. Overall it enables more flexibility when committing to SocialDB. For example, you can commit when Enter key pressed.
   * More info: {@link https://docs.near.org/bos/api/social#socialset}
   * @param data the data object to be committed. Similar to `CommitButton`, it shouldn't start with an account ID.
   * @param options {@link SocialSetOptions | optional} object.
   */
  function set(data: object, options?: SocialSetOptions): void;
}

/**
 * You can access the `context` object to get specific information about the VM instance.
 * More info {@link https://docs.near.org/bos/home#vm-context}
 */
declare namespace context {
  /**
   * @param networkId `mainnet` or `testnet`.
   */
  const networkId: NetworkId;
  const accountId: string;
}
