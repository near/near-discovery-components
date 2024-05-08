const { fetchGraphQL, GRAPHQL_ENDPOINT } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client");

if (!fetchGraphQL || !GRAPHQL_ENDPOINT) return <></>;

const limit = props.limit ?? 10;
const feeds = props.feeds ?? ["all", "following"];
const feedLabels = { all: "All", following: "Following", mutual: "Mutual Activity" };
const showCompose = props.showCompose ?? true;
const filteredAccountIds = props.filteredAccountIds;

const sortRaw = Storage.get("queryapi:feed-sort");
const sort = sortRaw ?? (sortRaw === undefined ? "timedesc" : null);
const initialSelectedTabRaw = Storage.privateGet("selectedTab");
let initialSelectedTab = initialSelectedTabRaw ?? (initialSelectedTabRaw === undefined ? "all" : null);
if (!feeds.includes(initialSelectedTab)) {
  initialSelectedTab = feeds[0];
}
if (initialSelectedTab === "mutual" && !context.filteredAccountIds) {
  initialSelectedTab = feeds[0];
}

const followGraph = context.accountId ? Social.keys(`${context.accountId}/graph/follow/*`, "final") : null;
const accountsFollowing =
  props.accountsFollowing ?? (followGraph ? Object.keys(followGraph[context.accountId].graph.follow || {}) : null);

const optionsMap = {
  timedesc: "Most Recent",
  recentcommentdesc: "Recent Comments",
};

const selectTab = (newTab) => {
  stopFeedUpdates();
  setInitialQueryTime(null);
  Storage.privateSet("selectedTab", newTab);
  setIsLoading(true);
  setNewUnseenPosts([]);
  setPostsData({ posts: [], postsCountLeft: 0 });
  setSelectedTab(newTab);
};

const selectSort = (newSort) => {
  stopFeedUpdates();
  setInitialQueryTime(null);
  Storage.set("queryapi:feed-sort", newSort);
  setIsLoading(true);
  setNewUnseenPosts([]);
  setPostsData({ posts: [], postsCountLeft: 0 });
  setSortState(newSort);
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
const selfModeration = context.accountId ? Social.getr(`${context.accountId}/moderate`, "optimistic") ?? [] : [];
const postsModerationKey = ".post.main";
const commentsModerationKey = ".post.comment";
const matchesModeration = (moderated, socialDBObjectType, item) => {
  if (!moderated) return false;
  const accountFound = moderated[item.account_id];
  if (typeof accountFound === "undefined") {
    return false;
  }
  if (typeof accountFound === "string" || accountFound[""]) {
    return true;
  }
  const moderatedItemsOfType = accountFound[socialDBObjectType];
  return moderatedItemsOfType && typeof moderatedItemsOfType[item.block_height] !== "undefined";
};

const shouldFilter = (item, socialDBObjectType) => {
  return (
    selfFlaggedPosts.find((flagged) => {
      return flagged?.value?.blockHeight === item.block_height && flagged?.value?.path.includes(item.account_id);
    }) || matchesModeration(selfModeration, socialDBObjectType, item)
  );
};

const createQuery = (type, isUpdate) => {
  let querySortOption = "";
  switch (sortState) {
    case "recentcommentdesc":
      querySortOption = `{ last_comment_timestamp: desc_nulls_last },`;
      break;
    default:
      querySortOption = "";
  }

  let queryFilter = "";
  let timeOperation = "_lte";
  if (isUpdate) {
    timeOperation = "_gt";
  }

  const queryTime = initialQueryTime ? initialQueryTime : Date.now() * 1000000;

  switch (type) {
    case "following":
      let filteredAccountsFollowing = accountsFollowing ? accountsFollowing.push(context.accountId) : [];
      if (filteredAccountIds) {
        const filteredAccountList = filteredAccountIds.split(",");
        filteredAccountsFollowing = filteredAccountList.filter((account) => accountsFollowing.includes(account));
      }
      let queryAccountsString = accountsFollowing.map((account) => `"${account}"`).join(", ");
      queryFilter = `where: {
        _and: [
            { account_id: { _in: [${queryAccountsString}]} },
            {block_timestamp: {${timeOperation}: ${queryTime}}}
        ]
        },`;
      break;

    case "mutual":
      let userAccount = context.accountId;
      queryFilter = `where: {
          _and: [
            {account_id: {_in: "${filteredAccountIds}"}},
            {_or: [
              {post_likes: {account_id: {_eq: "${userAccount}"}}},
              {comments: {account_id: {_eq: "${userAccount}"}}}
              ]
            },
            {block_timestamp: {${timeOperation}: ${queryTime}}}
          ]
        }`;
      break;

    default:
      if (filteredAccountIds) {
        queryFilter = `where: {
          _and: [
            {account_id: {_in: "${filteredAccountIds}"}},
            {block_timestamp: {${timeOperation}: ${queryTime}}}
          ]
        }, `;
      } else {
        queryFilter = `where: {
          _and: [
            {block_timestamp: {${timeOperation}: ${queryTime}}}
          ]
        }, `;
      }
  }

  return `
query FeedQuery($offset: Int, $limit: Int) {
  dataplatform_near_feed_moderated_posts_with_reposts_feed(${queryFilter} order_by: [${querySortOption} { block_height: desc }], offset: $offset, limit: $limit) {
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
    profile: account {
      name
      image
      tags
    }
  }
  
dataplatform_near_feed_moderated_posts_with_reposts_feed_aggregate(${queryFilter} order_by: {id: asc}) {
    aggregate {
      count
    }
  }
 
}
`;
};

const loadMorePosts = (isUpdate) => {
  if (!selectedTab) {
    return;
  }
  const queryName = "FeedQuery";

  if (selectedTab === "following" && !accountsFollowing) {
    return;
  }

  if (!isUpdate) {
    setIsLoading(true);
  }
  const offset = isUpdate ? 0 : postsData.posts.length;
  fetchGraphQL(createQuery(selectedTab, isUpdate), queryName, {
    offset,
    limit,
  }).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newPosts = data.dataplatform_near_feed_moderated_posts_with_reposts_feed;
        const postsCountLeft = data.dataplatform_near_feed_moderated_posts_with_reposts_feed_aggregate.aggregate.count;
        if (newPosts.length > 0) {
          let filteredPosts = newPosts.filter((i) => !shouldFilter(i, postsModerationKey));
          filteredPosts = filteredPosts.map((post) => {
            const image = post.profile?.image ? JSON.parse(post.profile.image ?? "") : null;
            const tags = post.profile?.tags ? JSON.parse(post.profile.tags ?? "") : null;
            const prevComments = post.comments;
            const filteredComments = prevComments.filter((comment) => !shouldFilter(comment, commentsModerationKey));
            post.comments = filteredComments;
            post.profile = {
              name: post.profile?.name,
              image,
              tags,
            };
            return post;
          });

          if (isUpdate) {
            setNewUnseenPosts(filteredPosts);
          } else {
            setPostsData({
              posts: [...postsData.posts, ...filteredPosts],
              postsCountLeft,
            });
            setIsLoading(false);
          }
          checkForOptimisticPostsHaveBeenReceived(newPosts);
        }
      }
    }
    if (!isUpdate && initialQueryTime === null) {
      const newTime = postsData.posts && postsData.posts[0] ? postsData.posts[0].block_timestamp : Date.now() * 1000000;
      setInitialQueryTime(newTime + 1000);
    }
  });
};

const clearOptimisticUpdate = () => {
  Storage.set("optimisticPosts", []);
  setOptimisticPostsState([]);
};
const optimisticallyUpdatePost = (post) => {
  Storage.set("optimisticPosts", [post]);
  setOptimisticPostsState([post]);
};

const checkForOptimisticPostsHaveBeenReceived = (posts) => {
  const latestOptimisticPost =
    (optimisticPostsState && optimisticPostsState[0]) ??
    (Storage.get("optimisticPosts") && Storage.get("optimisticPosts")[0]);
  if (!latestOptimisticPost) return;

  const latestPostsByUser = posts.filter((p) => p.account_id === latestOptimisticPost.account_id) ?? [];

  if (
    latestOptimisticPost &&
    latestPostsByUser &&
    latestPostsByUser.find((p) => {
      if (!p.content || !latestOptimisticPost.content) return false;
      const postContent = typeof p.content === "string" ? JSON.parse(p.content) : props.content;
      return (
        postContent.type === latestOptimisticPost.content.type &&
        (postContent.text === latestOptimisticPost.content.text ||
          postContent.image === latestOptimisticPost.content.image)
      );
    })
  ) {
    clearOptimisticUpdate();
  }
};

const displayNewPosts = () => {
  if (newUnseenPosts.length > 0) {
    stopFeedUpdates();
    const initialQueryTime = newUnseenPosts[0].block_timestamp + 1000; // timestamp is getting rounded by 3 digits
    const newTotalCount = postsData.postsCountLeft + newUnseenPosts.length;
    setPostsData({
      posts: [...newUnseenPosts, ...postsData.posts],
      postsCountLeft: newTotalCount,
    });
    setNewUnseenPosts([]);
    setInitialQueryTime(initialQueryTime);
  }
};
const startFeedUpdates = () => {
  if (initialQueryTime === null) return;

  clearInterval(feedInterval);
  const newFeedInterval = setInterval(() => {
    loadMorePosts(true);
  }, 5000);
  setFeedInterval(newFeedInterval);
};

const stopFeedUpdates = () => {
  clearInterval(feedInterval);
};

const [initialized, setInitialized] = useState(false);
const [sortState, setSortState] = useState(false);
const [selectedTab, setSelectedTab] = useState(false);
const [optimisticPostsState, setOptimisticPostsState] = useState([]);
const [initialQueryTime, setInitialQueryTime] = useState(null);
const [feedInterval, setFeedInterval] = useState(null);
const [newUnseenPosts, setNewUnseenPosts] = useState([]);
const [postsData, setPostsData] = useState({ posts: [], postsCountLeft: 0 });
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  loadMorePosts(false);
}, [selectedTab]);
useEffect(() => {
  loadMorePosts(false);
}, [sortState]);
useEffect(() => {
  if (initialQueryTime === null) {
    clearInterval(feedInterval);
  } else {
    startFeedUpdates();
  }
}, [initialQueryTime]);

const hasMore = postsData.postsCountLeft !== postsData.posts.length && postsData.posts.length > 0;

if (!initialized && initialSelectedTab && initialSelectedTab !== selectedTab && sort) {
  setInitialized(true);
  Storage.privateSet("selectedTab", selectedTab);
  setSortState(sort);
  setSelectedTab(initialSelectedTab);
}

const optimisticPosts = Storage.get("optimisticPosts") ?? optimisticPostsState ?? [];
if (optimisticPosts.length > 0) {
  const timestamp = optimisticPosts[0].block_timestamp;
  if (!timestamp || Date.now() - timestamp / 1000000 > 60000) {
    clearOptimisticUpdate();
  }
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
const H3 = styled.h3`
  font-size: 15px;
  line-height: 8px;
  color: #11181c;
  margin: 0 0 12px;

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
const OptimisticUpdatePost = styled.div`
  border-top: 1px solid #eceef0;
  border-bottom: 1px solid #eceef0;
  padding: 24px 24px 12px;
  @media (max-width: 1024px) {
    padding: 12px 0 0;
  }
`;
const NewActivity = styled.div`
  text-align: right;
  padding: 0px 10px;
`;

if (!selectedTab) {
  return "Loading feeds...";
}

return (
  <>
    <H2>Posts</H2>

    <Content>
      {context.accountId && (
        <>
          {showCompose && (
            <>
              <ComposeWrapper>
                <Widget
                  src="${REPL_ACCOUNT}/widget/Posts.Compose"
                  props={{
                    optimisticUpdateFn: optimisticallyUpdatePost,
                    clearOptimisticUpdateFn: clearOptimisticUpdate,
                  }}
                />
              </ComposeWrapper>
              {optimisticPosts.map((item) => (
                <OptimisticUpdatePost>
                  <H3>Post awaiting Feed display</H3>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/Posts.Post"
                    props={{
                      accountId: item.account_id,
                      blockHeight: item.block_height,
                      blockTimestamp: item.block_timestamp,
                      content: item.content,
                      comments: item.comments,
                      likes: item.accounts_liked,
                      GRAPHQL_ENDPOINT: props.GRAPHQL_ENDPOINT ?? GRAPHQL_ENDPOINT,
                      verifications: item.verifications,
                      showFlagAccountFeature: false,
                    }}
                  />
                </OptimisticUpdatePost>
              ))}
            </>
          )}
          <div className="row">
            <div className="col">
              {feeds.length > 1 && (
                <FilterWrapper>
                  <PillSelect>
                    {feeds.map((feed) => (
                      <PillSelectButton type="button" onClick={() => selectTab(feed)} selected={selectedTab === feed}>
                        {feedLabels[feed] ?? feed}
                      </PillSelectButton>
                    ))}
                  </PillSelect>
                </FilterWrapper>
              )}
            </div>
            <div className="col">
              <SortContainer>
                <Sort>
                  <Widget
                    src={`${REPL_ACCOUNT}/widget/Select`}
                    props={{
                      noLabel: true,
                      value: { text: optionsMap[sort], value: sort },
                      onChange: ({ value }) => selectSort(value),
                      options: [
                        { text: "Latest", value: "timedesc" },
                        { text: "Last Commented", value: "recentcommentdesc" },
                      ],
                      border: "none",
                    }}
                  />
                </Sort>
              </SortContainer>
            </div>
          </div>
          <div className="row">
            <div className="col"></div>
            <div className="col">
              {newUnseenPosts.length > 0 && (
                <NewActivity>
                  <Widget
                    src="${REPL_ACCOUNT}/widget/DIG.Button"
                    props={{
                      label: `Refresh (${newUnseenPosts.length} New)`,
                      onClick: displayNewPosts,
                      iconLeft: "bi-arrow-clockwise",
                      variant: "secondary",
                      fill: "ghost",
                      size: "small",
                    }}
                  />
                </NewActivity>
              )}
            </div>
          </div>
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
                loadMorePosts(false);
              }
            },
            posts: postsData.posts,
            showFlagAccountFeature: props.showFlagAccountFeature,
          }}
        />
      </FeedWrapper>
    </Content>
  </>
);
