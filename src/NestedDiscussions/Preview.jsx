const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);
const parentComponent = props.parentComponent;
const parentParams = { ...props.parentParams };
const highlightComment = props.highlightComment;
const moderatorAccount = props.moderatorAccount || "${REPL_MODERATOR}";

const { content } = JSON.parse(
  Social.get(`${accountId}/discuss/main`, blockHeight)
);

State.init({ hasBeenFlagged: false });

const notificationParams = {
  ...parentParams,
  highlightComment: content.commentId,
};

// URL to share
var postUrl = `https://${REPL_NEAR_URL}/#/${parentComponent}?`;
postUrl += Object.entries(notificationParams)
  .map(([k, v]) => `${k}=${v}`)
  .join("&");

// all children comments will be identified by this object
const indexKey = {
  accountId,
  blockHeight,
};

const Post = styled.div`
  position: relative;
  ${
    content.commentId == highlightComment
      ? "border-left: 4px solid aqua; padding-left: 1rem;"
      : ""
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: 12px;
    width: 2px;
    background: #eceef0;
  }
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
`;

const Body = styled.div`
  padding-left: 52px;
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

const Comments = styled.div`
  > div > div:first-child {
    padding-top: 12px;
  }
`;

if (state.hasBeenFlagged) {
  return (
    <div className="alert alert-secondary">
      <i className="bi bi-flag" /> This content has been flagged for moderation
    </div>
  );
}

return (
  <Post id={content.commentId == highlightComment ? "highlight" : ""}>
    <Header>
      <Widget
        src="${REPL_ACCOUNT}/widget/AccountProfile"
        props={{
          accountId,
          hideAccountId: true,
          inlineContent: (
            <>
              <Text as="span">･</Text>
              <Text>
                <Widget src="${REPL_MOB_2}/widget/TimeAgo" props={{ blockHeight }} />{" "}
                ago
              </Text>
            </>
          ),
        }}
      />
    </Header>
    <Body>
      <Content>
        {content.text && (
          <Widget
            src="${REPL_ACCOUNT}/widget/SocialMarkdown"
            props={{ text: content.text }}
          />
        )}

        {content.image && (
          <Widget
            src="${REPL_MOB}/widget/Image"
            props={{
              image: content.image,
            }}
          />
        )}
      </Content>

      {blockHeight !== "now" && (
        <Actions>
          <Widget
            src="${REPL_ACCOUNT}/widget/NestedDiscussions.Preview.LikeButton"
            props={{
              item: content.commentId,
              notificationComponent: parentComponent,
              notificationParams,
              notifyAccountId: accountId,
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/NestedDiscussions.Preview.CommentButton"
            props={{
              item: indexKey,
              onClick: () => State.update({ showReply: !state.showReply }),
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/CopyUrlButton"
            props={{
              url: postUrl,
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/FlagButton"
            props={{
              item: {
                type: "social",
                path: `${accountId}/discuss`,
                blockHeight,
              },
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
            src="${REPL_ACCOUNT}/widget/NestedDiscussions.Compose"
            props={{
              indexKey,
              notifyAccountId: accountId,
              notificationWidget: parentComponent,
              notificationParams,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}

      <Comments>
        <Widget
          src="${REPL_ACCOUNT}/widget/NestedDiscussions.Feed"
          props={{
            indexKey,
            moderatorAccount,
            parentComponent,
            parentParams,
            highlightComment,
          }}
        />
      </Comments>
    </Body>
  </Post>
);
