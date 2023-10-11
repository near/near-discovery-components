const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
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

const TextLink = styled.a`
  font-weight: 600;
`;

const renderItem = (item) => {
  if (item.accounts_liked.length !== 0) {
    item.accounts_liked = JSON.parse(item.accounts_liked);
  }
  return (
    <Post className="post" key={item.block_height + "_" + item.account_id}>
      <Widget
        src="${REPL_ACCOUNT}/widget/Posts.Post"
        props={{
          accountId: item.account_id,
          blockHeight: item.block_height,
          content: item.content,
          comments: item.comments,
          likes: item.accounts_liked,
          GRAPHQL_ENDPOINT,
          verifications: item.verifications,
          showFlagAccountFeature: props.showFlagAccountFeature ?? false,
        }}
      />
    </Post>
  );
};

if (posts.length === 0) {
  return (
    <div class="alert alert-info mx-3" role="alert">
      Build your feed by finding
      <TextLink
        className="alert-link"
        href="${REPL_ACCOUNT}/widget/PeoplePage"
      >
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
