State.init({
  initialized: false,
  isLoading: false,
  selectedTab: null,
  posts: [],
  postsCountLeft: 0,
  sort: null,
});

const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const LIMIT = 10;
const moderatorAccount = props?.moderatorAccount || "bosmod.near";
const sortRaw = Storage.get("queryapi:feed-sort");
const sort = sortRaw ?? (sortRaw === undefined ? "timedesc" : null);
const initialSelectedTabRaw = Storage.privateGet("selectedTab");
const initialSelectedTab =
  initialSelectedTabRaw ?? (initialSelectedTabRaw === undefined ? "all" : null);
const followGraph = context.accountId
  ? Social.keys(`${context.accountId}/graph/follow/*`, "final")
  : null;
const accountsFollowing =
  props.accountsFollowing ??
  (followGraph
    ? Object.keys(followGraph[context.accountId].graph.follow || {})
    : null);
const isLoading = !state.initialized || state.isLoading;

const optionsMap = {
  timedesc: "Most Recent",
  recentcommentdesc: "Recent Comments",
};

const selectTab = (selectedTab) => {
  Storage.privateSet("selectedTab", selectedTab);
  State.update({
    posts: [],
    postsCountLeft: 0,
    selectedTab,
  });
  loadMorePosts();
};

// get the full list of posts that the current user has flagged so
// they can be hidden
const selfFlaggedPosts = context.accountId
  ? Social.index("flag", "main", {
      accountId: context.accountId,
    }) ?? []
  : [];

// V2 self moderation data, structure is like:
// { moderate: {
//     "account1.near": "report",
//     "account2.near": {
//         ".post.main": { // slashes are not allowed in keys
//           "100000123": "spam", // post ids are account/blockHeight
//         }
//     },
//   }
// }
const selfModeration = context.accountId
  ? Social.getr(`${context.accountId}/moderate`, "optimistic") ?? []
  : [];
const postsModerationKey = ".post.main";
const matchesModeration = (moderated, socialDBObjectType, item) => {
  if (!moderated) return false;
  const accountFound = moderated[item.account_id];
  if (typeof accountFound === "undefined") {
    return false;
  }
  if (typeof accountFound === "string") {
    return true;
  }
  // match posts
  const posts = accountFound[postsModerationKey];
  return posts && typeof posts[item.block_height] !== "undefined";
};

const shouldFilter = (item) => {
  return (
    selfFlaggedPosts.find((flagged) => {
      return (
        flagged?.value?.blockHeight === item.block_height &&
        flagged?.value?.path.includes(item.account_id)
      );
    }) || matchesModeration(selfModeration, postsModerationKey, item)
  );
};
function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const createQuery = (type) => {
  let querySortOption = "";
  switch (state.sort) {
    case "recentcommentdesc":
      querySortOption = `{ last_comment_timestamp: desc_nulls_last },`;
      break;
    // More options...
    default:
      querySortOption = "";
  }

  let queryFilter = "";
  switch (type) {
    case "following":
      let queryAccountsString = accountsFollowing
        .map((account) => `"${account}"`)
        .join(", ");
      queryFilter = `account_id: { _in: [${queryAccountsString}]}`;
      break;
    // More options...
    default:
      queryFilter = "";
  }

  const indexerQueries = `
query GetPostsQuery($offset: Int, $limit: Int) {
  dataplatform_near_social_feed_moderated_posts(order_by: [${querySortOption} { block_height: desc }], offset: $offset, limit: $limit) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    last_comment_timestamp
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
    }
    verifications {
      human_provider
      human_valid_until
      human_verification_level
    }
  }
  dataplatform_near_social_feed_moderated_posts_aggregate {
    aggregate {
      count
    }
  }
}
query GetFollowingPosts($offset: Int, $limit: Int) {
  dataplatform_near_social_feed_moderated_posts(where: {${queryFilter}}, order_by: [{ block_height: desc }], offset: $offset, limit: $limit) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    last_comment_timestamp
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
    }
    verifications {
      human_provider
      human_valid_until
      human_verification_level
    }

  }
  dataplatform_near_social_feed_moderated_posts_aggregate(where: {${queryFilter}}) {
    aggregate {
      count
    }
  }
}
`;
  return indexerQueries;
};

const loadMorePosts = () => {
  const queryName =
    state.selectedTab === "following" ? "GetFollowingPosts" : "GetPostsQuery";
  const type = state.selectedTab;

  if (state.selectedTab === "following" && !accountsFollowing) {
    return;
  }

  State.update({
    isLoading: true,
  });

  fetchGraphQL(createQuery(type), queryName, {
    offset: state.posts.length,
    limit: LIMIT,
  }).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newPosts = data.dataplatform_near_social_feed_moderated_posts;
        const postsCountLeft =
          data.dataplatform_near_social_feed_moderated_posts_aggregate.aggregate
            .count;
        if (newPosts.length > 0) {
          let filteredPosts = newPosts.filter((i) => !shouldFilter(i));
          filteredPosts = filteredPosts.map((post) => {
            const prevComments = post.comments;
            const filteredComments = prevComments.filter(
              (comment) => !shouldFilter(comment)
            );
            post.comments = filteredComments;
            return post;
          });

          State.update({
            isLoading: false,
            posts: [...state.posts, ...filteredPosts],
            postsCountLeft,
          });
        }
      }
    }
  });
};

const hasMore =
  state.postsCountLeft !== state.posts.length && state.posts.length > 0;

if (
  !state.initialized &&
  initialSelectedTab &&
  initialSelectedTab !== state.selectedTab &&
  sort
) {
  if (initialSelectedTab === "following" && !accountsFollowing) return null;

  State.update({ initialized: true, sort });
  selectTab(initialSelectedTab);
}

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0 0 24px;
  padding: 0 24px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Content = styled.div`
  @media (max-width: 1024px) {
    > div:first-child {
      border-top: none;
    }
  }
`;

const ComposeWrapper = styled.div`
  border-top: 1px solid #eceef0;
`;
const FilterWrapper = styled.div`
  border-top: 1px solid #eceef0;
  padding: 24px 24px 0;

  @media (max-width: 1024px) {
    padding: 12px;
  }
`;

const PillSelect = styled.div`
  display: inline-flex;
  align-items: center;

  @media (max-width: 600px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const PillSelectButton = styled.button`
  display: block;
  position: relative;
  border: 1px solid #e6e8eb;
  border-right: none;
  padding: 3px 24px;
  border-radius: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.selected ? "#fff" : "#687076")};
  background: ${(p) => (p.selected ? "var(--violet10) !important" : "#FBFCFD")};
  font-weight: 600;
  transition: all 200ms;

  &:hover {
    background: #ecedee;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: var(--violet10) !important;
    box-shadow: 0 0 0 1px var(--violet10);
    z-index: 5;
  }

  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  &:last-child {
    border-radius: 0 6px 6px 0;
    border-right: 1px solid #e6e8eb;
  }
`;

const FeedWrapper = styled.div`
  .post {
    padding-left: 24px;
    padding-right: 24px;

    @media (max-width: 1024px) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`;

const Sort = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  & > span.label {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #11181c;
    white-space: nowrap;
  }

  &:last-child {
    width: 40%;

    @media screen and (max-width: 768px) {
      width: 85%;
    }
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 24px 24px 0;

  @media (max-width: 1200px) {
    padding: 12px;
  }
`;

return (
  <>
    <H2>Posts</H2>

    <Content>
      {context.accountId && (
        <>
          <ComposeWrapper>
            <Widget src="${REPL_ACCOUNT}/widget/Posts.Compose" />
          </ComposeWrapper>

          <FilterWrapper>
            <PillSelect>
              <PillSelectButton
                type="button"
                onClick={() => selectTab("all")}
                selected={state.selectedTab === "all"}
              >
                All
              </PillSelectButton>

              <PillSelectButton
                type="button"
                onClick={() => selectTab("following")}
                selected={state.selectedTab === "following"}
              >
                Following
              </PillSelectButton>
            </PillSelect>
          </FilterWrapper>

          <SortContainer>
            {state.selectedTab === "all" && (
              <Sort>
                <span className="label">Sort by:</span>
                <Widget
                  src={`${REPL_ACCOUNT}/widget/Select`}
                  props={{
                    noLabel: true,
                    value: { text: optionsMap[sort], value: sort },
                    onChange: ({ value }) => {
                      Storage.set("queryapi:feed-sort", value);
                      State.update({
                        posts: [],
                        postsCountLeft: 0,
                        sort: value,
                      });
                      loadMorePosts();
                    },
                    options: [
                      { text: "Most Recent", value: "timedesc" },
                      { text: "Recent Comments", value: "recentcommentdesc" },
                    ],
                  }}
                />
              </Sort>
            )}
          </SortContainer>
        </>
      )}

      <FeedWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/Posts.Feed"
          props={{
            hasMore,
            isLoading,
            loadMorePosts: () => {
              if (!isLoading) {
                loadMorePosts();
              }
            },
            posts: state.posts,
            showFlagAccountFeature: props.showFlagAccountFeature,
          }}
        />
      </FeedWrapper>
    </Content>
  </>
);
