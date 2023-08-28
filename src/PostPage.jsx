const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const commentBlockHeight = parseInt(props.commentBlockHeight);

State.init({
  parentPostLoaded: false,
  originalPostLikes: undefined,
  originalAuthorAccountId: undefined,
  originalAuthorBlockHeight: undefined,
  originalPostContent: undefined,
});

const parentPostByComment = `query ParentPostByComment {
  dataplatform_near_social_feed_comments(
    where: {_and: {account_id: {_eq: "${accountId}"}, block_height: {_eq: ${commentBlockHeight}}}}
  ) {
    post {
      account_id
      accounts_liked
      block_height
      block_timestamp
      content
      id
      receipt_id
      comments {
        account_id
        block_height
        block_timestamp
        content
        receipt_id
        id
      }
      post_likes {
        account_id
        block_height
        block_timestamp
        receipt_id
      }
    }
    receipt_id
    id
  }
}`;

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

if (commentBlockHeight) {
  fetchGraphQL(parentPostByComment, "ParentPostByComment", {}).then(
    (result) => {
      if (result.status === 200) {
        if (result.body.data) {
          const posts = result.body.data.dataplatform_near_social_feed_comments;
          if (posts.length > 0) {
            const post = posts[0].post;
            let content = JSON.parse(post.content);
            const comments = post.comments;
            State.update({
              parentPostLoaded: true,
              originalAuthorAccountId: post.account_id,
              originalAuthorBlockHeight: post.block_height,
              originalPostContent: content,
              comments: comments,
              originalPostLikes: post.accounts_liked,
            });
          }
        }
      }
    }
  );
}
if (state.parentPostLoaded && commentBlockHeight) {
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/Posts.Post"
      props={{
        accountId: state.originalAuthorAccountId,
        blockHeight: state.originalAuthorBlockHeight,
        content: state.originalPostContent,
        highlightComment: { accountId, blockHeight: commentBlockHeight },
        comments: state.comments,
        likes: state.likes,
        GRAPHQL_ENDPOINT,
      }}
    />
  );
}

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/Posts.Post"
    props={{
      ...props,
      commentsLimit: 30,
      GRAPHQL_ENDPOINT,
    }}
  />
);
