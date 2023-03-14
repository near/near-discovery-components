const index = props.index;
if (!index) {
  return "props.index is not defined";
}

const moderatorAccount = props?.moderatorAccount || "adminalpha.near";

const filterUsersRaw = Social.get(
  `${moderatorAccount}/moderate/users`, //TODO
  "optimistic",
  {
    subscribe: true,
  }
);
if (filterUsers === null) {
  // haven't loaded filter list yet, return early
  return "";
}
const filterUsers = filterUsersRaw ? JSON.parse(filterUsersRaw) : [];

// WIP refresh in place when moderation list changes
// const jFilterUsers = JSON.stringify(filterUsers);
// if (state.filterUsers !== jFilterUsers) {
//   State.update({ filterUsers: jFilterUsers, cachedItems: {} });
// }

const renderItem =
  props.renderItem ??
  ((item, i) => (
    <div key={i}>
      #{item.blockHeight}: {JSON.stringify(item)}
    </div>
  ));
const cachedRenderItem = (item, i) => {
  const key = JSON.stringify(item);

  if (!(key in state.cachedItems)) {
    state.cachedItems[key] = renderItem(item, i);
    State.update();
  }
  return state.cachedItems[key];
};

index.options = index.options || {};
const initialRenderLimit =
  props.initialRenderLimit ?? index.options.limit ?? 10;
const addDisplayCount = props.nextLimit ?? initialRenderLimit;

index.options.limit = Math.min(
  Math.max(initialRenderLimit + addDisplayCount * 2, index.options.limit),
  100
);
const reverse = !!props.reverse;

let initialItems = Social.index(index.action, index.key, index.options);
if (initialItems === null) {
  return "";
}
const initialFoundItems = !!initialItems.length;
// moderate
initialItems = initialItems.filter((i) => !filterUsers.includes(i.accountId));

const computeFetchFrom = (items, limit, previouslyFoundItems) => {
  // we must get an explicit bool on whether we previously found items
  // in order to determine whether to do the next fetch since we can't
  // rely on the previous fetched count being less than the limit with
  // moderation now in the picture
  if (!previouslyFoundItems) {
    return false;
  }

  const blockHeight = items[items.length - 1].blockHeight;
  return index.options.order === "desc" ? blockHeight - 1 : blockHeight + 1;
};

const mergeItems = (newItems) => {
  const items = [
    ...new Set([...newItems, ...state.items].map((i) => JSON.stringify(i))),
  ].map((i) => JSON.parse(i));
  items.sort((a, b) => a.blockHeight - b.blockHeight);
  if (index.options.order === "desc") {
    items.reverse();
  }
  return items;
};

const jInitialItems = JSON.stringify(initialItems);
if (state.jInitialItems !== jInitialItems) {
  const jIndex = JSON.stringify(index);
  if (jIndex !== state.jIndex) {
    State.update({
      jIndex,
      jInitialItems,
      items: initialItems,
      fetchFrom: false,
      nextFetchFrom: computeFetchFrom(
        initialItems,
        index.options.limit,
        initialFoundItems
      ),
      displayCount: initialRenderLimit,
      cachedItems: {},
    });
  } else {
    State.update({
      jInitialItems,
      items: mergeItems(initialItems),
    });
  }
}

if (state.fetchFrom) {
  const limit = addDisplayCount;
  let newItems = Social.index(
    index.action,
    index.key,
    Object.assign({}, index.options, {
      from: state.fetchFrom,
      subscribe: undefined,
      limit,
    })
  );
  if (newItems !== null) {
    const newFoundItems = !!newItems.length;
    // moderate
    newItems = newItems.filter((i) => !filterUsers.includes(i.accountId));
    State.update({
      items: mergeItems(newItems),
      fetchFrom: false,
      nextFetchFrom: computeFetchFrom(newItems, limit, newFoundItems),
    });
  }
}

const makeMoreItems = () => {
  State.update({
    displayCount: state.displayCount + addDisplayCount,
  });
  if (
    state.items.length - state.displayCount < addDisplayCount * 2 &&
    !state.fetchFrom &&
    state.nextFetchFrom &&
    state.nextFetchFrom !== state.fetchFrom
  ) {
    State.update({
      fetchFrom: state.nextFetchFrom,
    });
  }
};

const loader = (
  <div className="loader" key={"loader"}>
    <span
      className="spinner-grow spinner-grow-sm me-1"
      role="status"
      aria-hidden="true"
    />
    Loading ...
  </div>
);

const fetchMore =
  props.manual &&
  (state.fetchFrom && state.items.length < state.displayCount
    ? loader
    : state.displayCount < state.items.length && (
        <div key={"loader more"}>
          <a href="javascript:void" onClick={(e) => makeMoreItems()}>
            {props.loadMoreText ?? "Load more..."}
          </a>
        </div>
      ));

const items = state.items ? state.items.slice(0, state.displayCount) : [];
if (reverse) {
  items.reverse();
}

const renderedItems = items.map(cachedRenderItem);

return props.manual ? (
  <>
    {reverse && fetchMore}
    {renderedItems}
    {!reverse && fetchMore}
  </>
) : (
  <InfiniteScroll
    pageStart={0}
    loadMore={makeMoreItems}
    hasMore={state.displayCount < state.items.length}
    loader={
      <div className="loader">
        <span
          className="spinner-grow spinner-grow-sm me-1"
          role="status"
          aria-hidden="true"
        />
        Loading ...
      </div>
    }
  >
    {renderedItems}
  </InfiniteScroll>
);
