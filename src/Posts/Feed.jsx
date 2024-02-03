const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const loadMorePosts = props.loadMorePosts;
const hasMore = props.hasMore || false;
const posts = props.posts || [];

const Post = styled.div`
  border-bottom: 1px solid #eceef0;
  padding: 24px 0 12px;
  @media (max-width: 1024px) {
    padding: 12px 0 0;
  }
`;

const TextLink = styled("Link")`
  font-weight: 600;
`;

function returnProfileForUser(post) {
  const image = post.profile_image ?? null;
  const name = post.profile_name ?? "";
  let tags = null;

  if (post.profile_tags) {
    tags = {};
    post.profile_tags.forEach((tag) => (tags[tag] = ""));
  }

  console.log("image: ", image);

  if (image && tags) {
    return {
      image,
      name,
      tags,
    };
  }

  return null;
}

const renderItem = (item) => {
  if (item.accounts_liked.length !== 0) {
    item.accounts_liked = JSON.parse(item.accounts_liked);
  }
  console.log("item", item);
  return (
    <Post className="post" key={item.block_height + "_" + item.account_id}>
      <Widget
        src="${REPL_ACCOUNT}/widget/Posts.Post"
        props={{
          accountId: item.account_id,
          blockHeight: item.block_height,
          blockTimestamp: item.block_timestamp,
          content: item.content,
          comments: item.comments,
          likes: item.accounts_liked,
          GRAPHQL_ENDPOINT,
          verifications: item.verifications,
          showFlagAccountFeature: props.showFlagAccountFeature ?? false,
          profile: returnProfileForUser(item),
        }}
      />
    </Post>
  );
};

if (posts.length === 0 && !props.isLoading) {
  return (
    <div className="alert alert-info mx-3" role="alert">
      Build your feed by finding
      <TextLink className="alert-link" href="${REPL_ACCOUNT}/widget/PeoplePage">
        people to follow
      </TextLink>
    </div>
  );
}

const renderedItems = posts.map(renderItem);

return (
  <InfiniteScroll
    pageStart={0}
    loadMore={loadMorePosts}
    hasMore={hasMore}
    initialLoad={false}
    loader={
      <div className="loader">
        <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
        Loading ...
      </div>
    }
  >
    {renderedItems}
  </InfiniteScroll>
);
