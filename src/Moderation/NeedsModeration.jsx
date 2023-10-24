const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const moderationStreamBase = props.moderationStream || moderatorAccount;

const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const LIMIT = 25;
State.init({
  items: [],
  itemCountLeft: 0,
  loadingState: "none",
  sort,
});

const moderationDataFormat = (accountId, path, blockHeight) => {
  let value = { label: "moderate" };
  value.path = accountId + (path ? path : "");
  if (blockHeight) {
    value.blockHeight = parseInt(blockHeight);
  }
  const moderationStream = moderationStreamBase + path;
  return JSON.stringify({
    key: moderationStream,
    value: value,
  });
};

const fetchGraphQL = (operationsDoc, operationName, variables) => {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
};

const createQuery = () => {
  let querySortOption = "";
  let queryFilter = "";

  const indexerQueries = `
query GetNeedsModeration($offset: Int, $limit: Int) {
  dataplatform_near_social_feed_needs_moderation(
      where: {${queryFilter}}
      order_by: [${querySortOption} { first_report_blockheight: desc }], 
      offset: $offset, limit: $limit) {
    account_id
    block_height
    moderated_path
    reporter_count
    reporter_list
    block_timestamp
    content
    receipt_id
    first_report_blockheight
  }
  dataplatform_near_social_feed_needs_moderation_aggregate {
    aggregate {
      count
    }
  }
}
`;
  return indexerQueries;
};

const loadItems = () => {
  const queryName = "GetNeedsModeration";
  return fetchGraphQL(createQuery(), queryName, {
    offset: state.items.length,
    limit: LIMIT,
  }).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newItems = data.dataplatform_near_social_feed_needs_moderation;
        const itemsCountLeft =
          data.dataplatform_near_social_feed_needs_moderation_aggregate
            .aggregate.count;
        if (newItems) {
          State.update({
            items: [...state.items, ...newItems],
            itemsCountLeft,
            loadingState: "loaded",
          });
        }
      }
    }
  });
};

if (!state.loadingState || state.loadingState === "none") {
  State.update({ loadingState: "loading" });
  state.loadingState = "loading";
  loadItems();
  return <p>Loading...</p>;
}
if (state.loadingState === "loaded" && state.items.length === 0) {
  return <p>✨ No items need moderation 🎉</p>;
}

const hasMore =
  state.loadingState === "loaded" && state.itemsCountLeft != state.items.length;

const pathToType = (path) => {
  switch (path) {
    case `/post/main`:
      return "Post";
    case `/post/comment`:
      return "Comment";
    case `/discuss`:
      return "Discussion";
    case null:
      return "Account";
    default:
      return "Unhandled Content Type" + path;
  }
};

const renderItem = (item) => {
  const accountId = item.account_id;
  const blockHeight = item.block_height;
  const id = `${accountId}_${item.first_report_blockheight ?? blockHeight}`;

  let renderWidget;
  switch (item.moderated_path) {
    case `/post/main`:
      if (item.accounts_liked && item.accounts_liked.length !== 0) {
        item.accounts_liked = JSON.parse(item.accounts_liked);
      }
      renderWidget = (
        <div className="post" key={item.block_height + "_" + item.account_id}>
          <Widget
            src="${REPL_ACCOUNT}/widget/Posts.Post"
            props={{
              accountId,
              blockHeight,
              blockTimestamp: item.block_timestamp,
              content: item.content,
              comments: item.comments,
              GRAPHQL_ENDPOINT,
              showFlagAccountFeature: false,
            }}
          />
        </div>
      );
      break;
    case `/post/comment`:
      renderWidget = (
        <Widget
          src={`${REPL_ACCOUNT}/widget/Comments.Comment`}
          props={{
            accountId,
            blockHeight,
            content: item.content,
            GRAPHQL_ENDPOINT,
            blockTimestamp: item.block_timestamp,
          }}
        />
      );
      break;
    case `/discuss`:
      renderWidget = (
        <Widget
          src="${REPL_ACCOUNT}/widget/NestedDiscussions.Preview"
          props={{
            accountId,
            blockHeight: item.blockHeight,
            dbAction: "discuss",
          }}
        />
      );
      break;
    case null: // account
      renderWidget = (
        <Widget
          src="${REPL_ACCOUNT}/widget/AccountProfile"
          props={{
            accountId,
            hideAccountId: true,
          }}
        />
      );
      break;
    default:
      console.log("Unknown moderated path", item);
  }

  const header = (
    <div key={id} style={{ width: "100%" }}>
      <div className="row">
        <div className="col">{pathToType(item.moderated_path)}</div>
        <div className="col-3">
          reported by {item.reporter_count} {item.reporter_count > 0 ? "users" : "user"}
        </div>
        <div className="col">
          <Widget
            src="near/widget/DIG.Tooltip"
            props={{
              content: "How long ago this item was first reported",
              trigger: (
                <>
                  <Widget
                    src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
                    props={{
                      blockHeight:
                        item.first_report_blockheight ?? item.block_height,
                    }}
                  />{" "}
                  ago
                </>
              ),
            }}
          />
        </div>
        <div className="col-lg-6 text-right">
          {item.moderated_path != null && (
            <span>
              <CommitButton
                force
                data={{
                  index: {
                    moderate: moderationDataFormat(
                      accountId,
                      item.moderated_path,
                      blockHeight,
                    ),
                  },
                }}
                onCommit={() => {
                  console.log(
                    "moderated",
                    item.account_id,
                    item.moderated_path,
                    item.block_height,
                  );
                  // todo hide the item, show toast.
                }}
              >
                Block {pathToType(item.moderated_path)}
              </CommitButton>
            </span>
          )}
          <span style={{ marginLeft: "30px" }}>
            <CommitButton
              force
              data={{
                index: {
                  moderate: moderationDataFormat(accountId),
                },
              }}
              onCommit={() => {
                console.log(
                  "moderated",
                  item.account_id,
                  item.moderated_path,
                  item.block_height,
                );
                // hide the item, show toast.
              }}
            >
              Moderate Account
            </CommitButton>
          </span>
        </div>
      </div>
    </div>
  );
  return { value: id, header, content: renderWidget };
};

const renderedItems = state.items.map(renderItem);

return (
  <InfiniteScroll
    className="mb-5"
    pageStart={0}
    loadMore={loadItems}
    hasMore={hasMore}
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
    <Widget
      src="near/widget/DIG.Accordion"
      props={{
        type: "multiple",
        items: renderedItems,
      }}
    />
  </InfiniteScroll>
);
