const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const subscribe = !!props.subscribe;
const notifyAccountId = accountId;
const postUrl = `https://near.org#/near/widget/PostPage?accountId=${accountId}&blockHeight=${blockHeight}`;

State.init({ hasBeenFlagged: false });

const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/main`, blockHeight) ?? "null");

const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const Post = styled.div`
  position: relative;

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
  <Post>
    <Header>
      <Widget
        src="near/widget/AccountProfile"
        props={{
          accountId,
          hideAccountId: true,
          inlineContent: (
            <>
              <Text as="span">･</Text>
              <Text>
                {blockHeight === "now" ? (
                  "now"
                ) : (
                  <>
                    <Widget
                      src="mob.near/widget/TimeAgo"
                      props={{ blockHeight }}
                    />{" "}
                    ago
                  </>
                )}
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
            src="near/widget/SocialMarkdown"
            props={{ text: content.text }}
          />
        )}

        {content.image && (
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: content.image,
            }}
          />
        )}
      </Content>

      {blockHeight !== "now" && (
        <Actions>
          <Widget
            src="near/widget/LikeButton"
            props={{
              item,
              notifyAccountId,
            }}
          />
          <Widget
            src="near/widget/CommentButton"
            props={{
              item,
              onClick: () => State.update({ showReply: !state.showReply }),
            }}
          />
          <Widget
            src="near/widget/CopyUrlButton"
            props={{
              url: postUrl,
            }}
          />
          <Widget
            src="near/widget/FlagButton"
            props={{
              item,
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
            src="near/widget/Comments.Compose"
            props={{
              notifyAccountId,
              item,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}

      <Comments>
        <Widget
          src="near/widget/Comments.Feed"
          props={{
            item,
            highlightComment: props.highlightComment,
            limit: props.commentsLimit,
            subscribe,
            raw,
          }}
        />
      </Comments>
    </Body>
  </Post>
);
