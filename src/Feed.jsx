const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const LIMIT = 25;
let accountsFollowing = props.accountsFollowing;
const moderatorAccount = props?.moderatorAccount || "bosmod.near";

State.init({
  posts: [],
  postsCountLeft: 0,
  initLoadPosts: false,
  initLoadPostsAll: false,
});

let filterUsersRaw = Social.get(
  `${moderatorAccount}/moderate/users`,
  "optimistic",
  {
    subscribe: true,
  }
);

if (filterUsersRaw === null) {
  // haven't loaded filter list yet, return early
  return "";
}

const filterUsers = filterUsersRaw ? JSON.parse(filterUsersRaw) : [];

const shouldFilter = (item) => {
  return filterUsers.includes(item.account_id);
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

const indexerQueries = `
query GetPostsQuery($offset: Int, $limit: Int) {
  dataplatform_near_social_feed_posts(order_by: [${querySortOption} { block_height: desc }], offset: $offset, limit: $limit) {
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
  }
  dataplatform_near_social_feed_posts_aggregate(order_by: [${querySortOption} { block_height: desc }], offset: $offset){
    aggregate {
      count
    }
  }
}
`;

const loadMorePosts = () => {
  fetchGraphQL(indexerQueries, "GetPostsQuery", {
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
        const newPosts = data.dataplatform_near_social_feed_posts;
        const postsCountLeft =
          data.dataplatform_near_social_feed_posts_aggregate.aggregate.count;
        if (newPosts.length > 0) {
          let filteredPosts = newPosts.filter((i) => !shouldFilter(i));
          filteredPosts = filteredPosts.map((post) => {
            const prevComments = post.comments;
            const filteredComments = post.comments.filter(
              (comment) => !shouldFilter(comment)
            );
            post.comments = filteredComments;
            return post;
          });

          State.update({
            posts: [...state.posts, ...filteredPosts],
            postsCountLeft,
          });
        }
      }
    }
  });
};

const hasMore = state.postsCountLeft != state.posts.length;

if (!state.initLoadPostsAll && filterUsers) {
  loadMorePosts();
  State.update({ initLoadPostsAll: true });
}

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/Posts.Feed"
    props={{
      hasMore,
      loadMorePosts,
      posts: state.posts,
    }}
  />
);
