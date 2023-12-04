const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const blockHeight = props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const highlight = !!props.highlight;
const commentUrl = `https://${REPL_NEAR_URL}/s/c?a=${accountId}&b=${blockHeight}`;
const item = props.item;

State.init({
  hasBeenFlaggedOptimistic: false,
  hasBeenFlagged: false,
  showToast: false,
  flaggedMessage: { header: "", detail: "" },
  content: JSON.parse(props.content) ?? undefined,
  notifyAccountId: undefined,
});

const extractNotifyAccountId = (parentItem) => {
  if (!parentItem || parentItem.type !== "social" || !parentItem.path) {
    return undefined;
  }
  const accountId = parentItem.path.split("/")[0];
  return `${accountId}/post/main` === parentItem.path ? accountId : undefined;
};

const optimisticallyHideItem = (message) => {
  // State change here prevents Social.set from firing
  // State.update({
  //   hasBeenFlaggedOptimistic: true,
  //   showToast: true,
  //   flaggedMessage: message,
  // });
};
const resolveHideItem = (message) => {
  State.update({
    hasBeenFlagged: true,
    showToast: true,
    flaggedMessage: message,
  });
};
const cancelHideItem = () => {
  State.update({
    hasBeenFlaggedOptimistic: false,
    showToast: false,
    flaggedMessage: { header: "", detail: "" },
  });
};
if (!state.content && accountId && blockHeight !== "now") {
  const commentQuery = `
query CommentQuery {
  dataplatform_near_social_feed_comments(
    where: {_and: {account_id: {_eq: "${accountId}"}, block_height: {_eq: ${blockHeight}}}}
  ) {
    content
    block_timestamp
    receipt_id
    post {
      account_id
      block_height
    }
  }
}
`;

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
  function postAsItem(post) {
    return {
      type: "social",
      path: `${post.account_id}/post/main`,
      blockHeight: post.block_height,
    };
  }

  fetchGraphQL(commentQuery, "CommentQuery", {}).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const comments = result.body.data.dataplatform_near_social_feed_comments;
        if (comments.length > 0) {
          const comment = comments[0];
          let content = JSON.parse(comment.content);

          content.item = postAsItem(comment.post);
          State.update({
            content: content,
            notifyAccountId: comment.post.accountId,
          });
        }
      }
    }
  });
}

const Comment = styled.div`
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 15px;
    top: 44px;
    bottom: 12px;
    width: 2px;
    background: ${props.highlight ? "#006ADC" : "#ECEEF0"};
  }
`;

const Header = styled.div`
  display: inline-flex;
  margin-bottom: 0;
`;

const Main = styled.div`
  padding-left: 44px;
  padding-bottom: 1px;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px -6px 6px;
`;

return (
  <>
    {state.showToast && (
      <Widget
        src={`${REPL_ACCOUNT}/widget/DIG.Toast`}
        props={{
          type: "info",
          title: state.flaggedMessage.header,
          description: state.flaggedMessage.detail,
          open: state.showToast,
          onOpenChange: () => {
            State.update({ showToast: false });
          },
          duration: 5000,
        }}
      />
    )}
    {!state.hasBeenFlagged && (
      <Comment>
        <Header>
          <div className="row">
            <div className="col-auto">
              <Widget
                src="${REPL_ACCOUNT}/widget/AccountProfile"
                props={{
                  accountId,
                  avatarSize: "32px",
                  hideAccountId: true,
                  inlineContent: (
                    <>
                      <Text as="span">･</Text>
                      {blockHeight === "now" ? (
                        "now"
                      ) : (
                        <Text>
                          <Widget src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}" props={{ blockHeight }} />{" "}
                          ago
                        </Text>
                      )}
                    </>
                  ),
                }}
              />
            </div>
            <div className="col-1">
              <div style={{ position: "absolute", right: 0, top: "2px" }}>
                <Widget
                  src="${REPL_ACCOUNT}/widget/Posts.Menu"
                  props={{
                    accountId: accountId,
                    blockHeight: blockHeight,
                    parentFunctions: {
                      optimisticallyHideItem,
                      resolveHideItem,
                      cancelHideItem,
                    },
                    contentType: "comment",
                    contentPath: `/post/comment`,
                  }}
                />
              </div>
            </div>
          </div>
        </Header>

        {!state.hasBeenFlaggedOptimistic && (
          <Main>
            {state.content && (
              <Content>
                {state.content.text && (
                  <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: state.content.text }} />
                )}


            {state.content.image && (
              <Widget
                src="${REPL_MOB}/widget/Image"
                props={{
                  image: state.content.image,
                }}
              />
            )}
          </Content>
          )}
          {blockHeight !== "now" && (
            <Actions>
              <Widget
                src="${REPL_ACCOUNT}/widget/v1.LikeButton"
                props={{
                  item: {
                    type: "social",
                    path: `${accountId}/post/comment`,
                    blockHeight,
                  },
                  notifyAccountId: state.notifyAccountId,
                }}
              />
              <Widget
                src="${REPL_ACCOUNT}/widget/CommentButton"
                props={{
                  hideCount: true,
                  onClick: () => State.update({ showReply: !state.showReply }),
                }}
              />
              <Widget
                src="${REPL_ACCOUNT}/widget/CopyUrlButton"
                props={{
                  url: commentUrl,
                }}
              />
              <Widget
                src="${REPL_ACCOUNT}/widget/ShareButton"
                props={{
                  postType: "comment",
                  url: commentUrl,
                }}
              />
              <Widget
                src="${REPL_ACCOUNT}/widget/FlagButton"
                props={{
                  item,
                  disabled: !context.accountId || context.accountId === accountId,
                  onFlag: () => {
                    State.update({ hasBeenFlagged: true });
                  },
                }}
              />
            </Actions>
          )}

          {state.showReply && (
            <div className="mb-2">
              <Widget
                src="${REPL_ACCOUNT}/widget/Comments.Compose"
                props={{
                  initialText: `@${accountId}, `,
                  notifyAccountId: extractNotifyAccountId(state.content.item),
                  item: item,
                  onComment: () => State.update({ showReply: false, }),
                }}
              />
            </div>
          )}
        </Main>
      )}
      </Comment>
    )}
    </>
    );
