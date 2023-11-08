const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const commentBlockHeight = parseInt(props.commentBlockHeight);

State.init({
  isLoading: true,
  postNotFound: false,
  isError: false,
  originalPostLikes: undefined,
  originalAuthorAccountId: undefined,
  originalAuthorBlockHeight: undefined,
  originalPostContent: undefined,
  moderated: false,
  moderationData: null,
  moderationType: null,
  moderationCommentPost: null,
});

const postQuery = commentBlockHeight
  ? `query ParentPostByComment {
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
}`
  : `query PostQuery {
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

const group = "near.org";
const moderationDecisionsQuery = (
  accountToCheck,
) => `query ModerationDecisions {
  dataplatform_near_moderation_moderation_decisions(
      where: {moderated_account_id: {_eq: "${accountToCheck}"}, group: {_eq: "${group}"}}) {
    moderated_account_id
    moderated_blockheight
    moderated_path
    label
  }
}`;
const unmoderatedCommentsQuery = `query UnmoderatedComments {
  dataplatform_near_social_feed_comments(
    where: {_and: {account_id: {_eq: "${accountId}"}, block_height: {_eq: ${commentBlockHeight}}}}
  ) {
    post {
      account_id
      block_height
      id
    }
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

const postsModerationKey = ".post.main";
const commentsModerationKey = ".post.comment";
const matchesModeration = (moderated, socialDBObjectType, item) => {
  if (!moderated) return false;
  const accountFound = moderated[item.account_id];
  if (typeof accountFound === "undefined") {
    return false;
  }
  if (typeof accountFound === "string") {
    return true;
  }
  const moderatedItemsOfType = accountFound[socialDBObjectType];
  return (
    moderatedItemsOfType &&
    typeof moderatedItemsOfType[item.block_height] !== "undefined"
  );
};
const moderationDataToCompactedFormat = (moderationData) => {
  const moderated = {};
  moderationData.forEach((moderationDecision) => {
    const {
      moderated_account_id,
      moderated_blockheight,
      moderated_path,
      label,
    } = moderationDecision;
    const modifiedPath = moderated_path?.replace(/\//g, ".");
    if (!moderated[moderated_account_id]) {
      moderated[moderated_account_id] = {};
    }
    if (modifiedPath && !moderated[moderated_account_id][modifiedPath]) {
      moderated[moderated_account_id][modifiedPath] = {};
    }
    if (!modifiedPath || modifiedPath === "") {
      moderated[moderated_account_id] = label;
    } else {
      moderated[moderated_account_id][modifiedPath][moderated_blockheight] =
        label;
    }
  });
  return moderated;
};

const globalModerationHandler = (result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const moderationData =
        result.body.data.dataplatform_near_moderation_moderation_decisions;
      if (moderationData.length > 0) {
        const compactedModerationData =
          moderationDataToCompactedFormat(moderationData);
        if (
          matchesModeration(
            compactedModerationData,
            commentBlockHeight ? commentsModerationKey : postsModerationKey,
            {
              account_id: props.accountId,
              block_height: commentBlockHeight
                ? commentBlockHeight
                : props.blockHeight,
            },
          )
        ) {
          State.update({
            isLoading: false,
            moderated: true,
            moderationData: compactedModerationData,
            moderationType: "global",
          });
          return;
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }
  State.update({
    isLoading: false,
    isError: true,
  });
};

const commentPostModerationHandler = (
  result,
  itemAccountId,
  itemBlockHeight,
) => {
  if (result.status === 200) {
    if (result.body.data) {
      const moderationData =
        result.body.data.dataplatform_near_moderation_moderation_decisions;
      if (moderationData.length > 0) {
        const compactedModerationData =
          moderationDataToCompactedFormat(moderationData);
        if (
          matchesModeration(compactedModerationData, postsModerationKey, {
            account_id: itemAccountId,
            block_height: itemBlockHeight,
          })
        ) {
          State.update({
            isLoading: false,
            moderated: true,
            moderationData: compactedModerationData,
            moderationType: "global",
            moderationCommentPost: {
              accountId: itemAccountId,
              blockHeight: itemBlockHeight,
            },
          });
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  State.update({
    isLoading: false,
    isError: true,
  });
};

const postHandler = (result, selfModerationData) => {
  if (result.status === 200) {
    if (result.body.data) {
      let post;
      if (commentBlockHeight) {
        const comments =
          result.body.data.dataplatform_near_social_feed_moderated_comments;
        if (comments.length == 0) {
          State.update({
            isLoading: false,
            postNotFound: true,
          });
          return;
        }
        if (comments[0].post == null) {
          // if we have a comment but no matching post then the post was moderated
          // but we need to look up the post populate the downstream data
          return fetchGraphQL(
            unmoderatedCommentsQuery,
            "UnmoderatedComments",
            {},
          ).then((result) => {
            // if we have data, do moderation
            // otherwise post is just missing.
            if (
              result.status === 200 &&
              result.body.data &&
              result.body.data.dataplatform_near_social_feed_comments.length > 0
            ) {
              const post =
                result.body.data.dataplatform_near_social_feed_comments[0].post;
              const postAccountId = post.account_id;
              const postBlockHeight = post.block_height;
              const checkPostModerationPromise = fetchGraphQL(
                moderationDecisionsQuery(postAccountId),
                "ModerationDecisions",
                {},
              );
              return checkPostModerationPromise
                .then((result) =>
                  commentPostModerationHandler(
                    result,
                    postAccountId,
                    postBlockHeight,
                  ),
                )
                .then((moderated) => {
                  if (!moderated) {
                    State.update({
                      isLoading: false,
                      postNotFound: true,
                    });
                    return;
                  }
                });
            }
          });
        }

        post = comments[0].post;
        const postAccountId = post.account_id;
        const postBlockHeight = post.block_height;

        if (matchesModeration(selfModerationData, postsModerationKey, post)) {
          State.update({
            isLoading: false,
            moderated: true,
            moderationData: selfModerationData,
            moderationType: "self",
            moderationCommentPost: {
              accountId: postAccountId,
              blockHeight: postBlockHeight,
            },
          });
          return;
        }
        const checkPostModerationPromise = fetchGraphQL(
          moderationDecisionsQuery(props.accountId),
          "ModerationDecisions",
          {},
        );
        return checkPostModerationPromise
          .then((result) =>
            commentPostModerationHandler(
              result,
              postAccountId,
              postBlockHeight,
            ),
          )
          .then((moderated) => {
            if (!moderated) {
              updateStateWithPost(post, selfModerationData);
              return;
            }
          });
      } else {
        const posts =
          result.body.data.dataplatform_near_social_feed_moderated_posts;
        if (posts.length == 0) {
          State.update({
            isLoading: false,
            postNotFound: true,
          });
          return;
        }
        post = posts[0];
        updateStateWithPost(post, selfModerationData);
        return;
      }
    }
  }
  State.update({
    isLoading: false,
    isError: true,
  });
};

const updateStateWithPost = (post, selfModerationData) => {
  let content = post.content;
  const comments = !post.comments
      ? []
      : post.comments?.filter((comment) => {
        if (
            matchesModeration(selfModerationData, commentsModerationKey, comment)
        ) {
          return false;
        }
        return true;
      });
  State.update({
    isLoading: false,
    originalAuthorAccountId: post.account_id,
    originalAuthorBlockHeight: post.block_height,
    originalPostContent: content,
    comments: comments,
    originalPostLikes: post.accounts_liked,
  });
};

if (state.isLoading) {
  let queryName = "PostQuery";
  if (commentBlockHeight) {
    queryName = "ParentPostByComment";
  }
  let selfModerationData = null;
  const postPromise = fetchGraphQL(postQuery, queryName, {});
  const decisionsPromise = fetchGraphQL(
    moderationDecisionsQuery(props.accountId),
    "ModerationDecisions",
    {},
  );

  if (context.accountId) {
    selfModerationData = context.accountId
      ? Social.getr(`${context.accountId}/moderate`, "optimistic") ?? []
      : [];

    if (
      matchesModeration(
        selfModerationData,
        commentBlockHeight ? commentsModerationKey : postsModerationKey,
        {
          account_id: props.accountId,
          block_height: commentBlockHeight
            ? commentBlockHeight
            : props.blockHeight,
        },
      )
    ) {
      State.update({
        isLoading: false,
        moderated: true,
        moderationData: selfModerationData,
        moderationType: "self",
      });
      return;
    }
  }

  postPromise.then((result) => postHandler(result, selfModerationData));
  decisionsPromise.then(globalModerationHandler);

  return (
    <div className="alert alert-info mx-3" role="alert">
      Loading...
    </div>
  );
}

if (state.isError) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Error loading data
    </div>
  );
}

if (state.moderated) {
  let accountId = props.accountId;
  let blockHeight = commentBlockHeight ? commentBlockHeight : props.blockHeight;
  let contentTypeKey = commentBlockHeight
    ? commentsModerationKey
    : postsModerationKey;
  if (state.moderationCommentPost) {
    accountId = state.moderationCommentPost.accountId;
    blockHeight = state.moderationCommentPost.blockHeight;
    contentTypeKey = postsModerationKey;
  }
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/Moderation.ModeratedItemMessage"
      props={{
        moderationData: state.moderationData,
        accountId,
        blockHeight,
        contentTypeKey,
        moderationType: state.moderationType,
      }}
    />
  );
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
return <Widget src="${REPL_ACCOUNT}/widget/Posts.Post" props={postProps} />;
