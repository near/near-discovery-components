const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);
const commentBlockHeight = parseInt(props.commentBlockHeight);
const renderPost = props.renderPost;

if (
  !props.accountId ||
  !(props.blockHeight || props.commentBlockHeight) ||
  !props.renderData
) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      One or more properties are missing.
    </div>
  );
}

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

const postQuery = `query PostQuery {
  dataplatform_near_social_feed_moderated_posts(
    order_by: {block_height: desc}
    where: {_and: {block_height: {_eq: ${props.blockHeight}}, account_id: {_eq: "${props.accountId}"}}}
  ) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
    }
  }
}`;
const commentQuery = `query ParentPostByComment {
  dataplatform_near_social_feed_moderated_comments(
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

const postHandler = (result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const collectionName = commentBlockHeight
        ? "dataplatform_near_social_feed_moderated_comments"
        : "dataplatform_near_social_feed_moderated_posts";
      const collection = result.body.data[collectionName];
      if (
        collection.length == 0 ||
        (commentBlockHeight && collection[0].post == null)
      ) {
        State.update({
          loadingState: "done",
          postNotFound: true,
        });
        return;
      }
      const post = commentBlockHeight ? collection[0].post : collection[0];
      updateStateWithPost(post);
      return;
    }
  }
  State.update({
    loadingState: "done",
    isError: true,
  });
};

const updateStateWithPost = (post) => {
  State.update({
    loadingState: "done",
    originalAuthorAccountId: post.account_id,
    originalAuthorBlockHeight: post.block_height,
    originalPostContent: post.content,
    comments: post.comments,
    originalPostLikes: post.accounts_liked,
  });
};

State.init({
  loadingState: "none",
  postNotFound: false,
  isError: false,
});

if (state.loadingState === "none") {
  State.update({
    loadingState: "loading",
  });
  let query = postQuery;
  let queryName = "PostQuery";
  if (commentBlockHeight) {
    query = commentQuery;
    queryName = "ParentPostByComment";
  }
  fetchGraphQL(query, queryName, {}).then((result) => postHandler(result));
}

if (state.postNotFound) {
  const type = commentBlockHeight ? "Comment" : "Post";
  return (
    <div className="alert alert-danger mx-3" role="alert">
      {type} not found
    </div>
  );
}

const postProps = {
  accountId: state.originalAuthorAccountId,
  blockHeight: state.originalAuthorBlockHeight,
  content: state.originalPostContent,
  comments: state.comments,
  likes: state.originalPostLikes,
  GRAPHQL_ENDPOINT,
};

if (commentBlockHeight) {
  postProps.highlightComment = { accountId, blockHeight: commentBlockHeight };
}
if (state.isError) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Error loading data
    </div>
  );
}
if (state.loadingState === "done") {
  return renderPost(postProps);
}
return (
  <div className="alert alert-info mx-3" role="alert">
    Loading...
  </div>
);
