const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);
const commentBlockHeight = parseInt(props.commentBlockHeight);

if (
  !props.accountId ||
  !(props.blockHeight || props.commentBlockHeight) ||
  !props.renderData
) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Invalid link, one or more parameters are missing.
    </div>
  );
}

const fetchGraphQL = (operationsDoc, operationName, variables, handleError) => {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  }).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        return result.body.data;
      }
    }
    return handleError(result);
  });
};
const handleError = (result) => {
  State.update({
    loadingState: "done",
    isError: true,
  });
};

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
const commentsPostQuery = `query CommentsPostQuery {
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

const globalModerationHandler = (
  data,
  itemAccountId,
  itemBlockHeight,
  itemModerationKey,
  isCommentPost,
) => {
  const moderationData = data.dataplatform_near_moderation_moderation_decisions;
  if (moderationData.length > 0) {
    const compactedModerationData =
      moderationDataToCompactedFormat(moderationData);
    if (
      matchesModeration(compactedModerationData, itemModerationKey, {
        account_id: itemAccountId,
        block_height: itemBlockHeight,
      })
    ) {
      if (isCommentPost) {
        State.update({
          loadingState: "done",
          moderated: true,
          moderationData: compactedModerationData,
          moderationType: "global",
          moderationCommentPost: {
            accountId: itemAccountId,
            blockHeight: itemBlockHeight,
          },
        });
      } else {
        State.update({
          loadingState: "done",
          moderated: true,
          moderationData: compactedModerationData,
          moderationType: "global",
        });
      }
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const commentPostModerationHandler = (data, selfModerationData) => {
  if (data.dataplatform_near_social_feed_comments.length > 0) {
    const post = data.dataplatform_near_social_feed_comments[0].post;
    const postAccountId = post.account_id;
    const postBlockHeight = post.block_height;

    if (
      context.accountId &&
      matchesModeration(selfModerationData, postsModerationKey, {
        account_id: postAccountId,
        block_height: postBlockHeight,
      })
    ) {
      State.update({
        loadingState: "done",
        moderated: true,
        moderationData: selfModerationData,
        moderationType: "self",
        moderationCommentPost: {
          accountId: postAccountId,
          blockHeight: postBlockHeight,
        },
      });
    } else {
      const checkPostModerationPromise = fetchGraphQL(
        moderationDecisionsQuery(postAccountId),
        "ModerationDecisions",
        {},
        handleError,
      );
      return checkPostModerationPromise.then((result) =>
        globalModerationHandler(
          result,
          postAccountId,
          postBlockHeight,
          postsModerationKey,
          true,
        ),
      );
    }
  }
};

State.init({
  loadingState: "none",
  isError: false,
  moderated: false,
  moderationData: null,
  moderationType: null,
  moderationCommentPost: null,
  selfModerationData: null,
});

const selfModerationData = context.accountId
  ? Social.getr(`${context.accountId}/moderate`, "optimistic") ?? false
  : [];
State.update({ selfModerationData });

if (state.selfModerationData && state.loadingState === "none") {
  State.update({
    loadingState: "loading",
  });

  const itemBlockHeight = commentBlockHeight ? commentBlockHeight : blockHeight;
  const itemModerationKey = commentBlockHeight
    ? commentsModerationKey
    : postsModerationKey;
  if (
    context.accountId &&
    matchesModeration(selfModerationData, itemModerationKey, {
      account_id: props.accountId,
      block_height: itemBlockHeight,
    })
  ) {
    State.update({
      loadingState: "done",
      moderated: true,
      moderationData: selfModerationData,
      moderationType: "self",
    });
  } else {
    const decisionsPromise = fetchGraphQL(
      moderationDecisionsQuery(accountId),
      "ModerationDecisions",
      {},
      handleError,
    ).then((result) =>
      globalModerationHandler(
        result,
        accountId,
        itemBlockHeight,
        itemModerationKey,
      ),
    );

    let commentPostModerationPromise = null;
    if (commentBlockHeight) {
      commentPostModerationPromise = fetchGraphQL(
        commentsPostQuery,
        "CommentsPostQuery",
        {},
        handleError,
      ).then((result) =>
        commentPostModerationHandler(result, selfModerationData),
      );
    } else {
      commentPostModerationPromise = Promise.resolve();
    }
    Promise.all([decisionsPromise, commentPostModerationPromise]).then(
      (_resultList) => {
        State.update({
          loadingState: "done",
        });
      },
    );
  }
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

if (state.isError) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Error loading data
    </div>
  );
}
if (state.loadingState === "done") {
  return props.renderData(props);
}
return (
  <div className="alert alert-info mx-3" role="alert">
    Loading...
  </div>
);
