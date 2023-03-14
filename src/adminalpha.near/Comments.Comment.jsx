const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/comment`, blockHeight) ?? "null");
const parentItem = content.item;
const highlight = !!props.highlight;
const raw = !!props.raw;

const extractNotifyAccountId = (parentItem) => {
  if (!parentItem || parentItem.type !== "social" || !parentItem.path) {
    return undefined;
  }
  const accountId = parentItem.path.split("/")[0];
  return `${accountId}/post/main` === parentItem.path ? accountId : undefined;
};

const commentUrl = `https://alpha.near.org/#/calebjacob.near/widget/PostPage?accountId=${accountId}&commentBlockHeight=${blockHeight}`;

const Comment = styled.div`
  position: relative;

  &::before {
    content: '';
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

const Body = styled.div`
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
  <Comment>
    <Header>
      <Widget
        src="calebjacob.near/widget/AccountProfile"
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
                  <Widget
                    src="mob.near/widget/TimeAgo"
                    props={{ blockHeight }}
                  />{" "}
                  ago
                </Text>
              )}
            </>
          ),
        }}
      />
    </Header>

    <Body>
      <Content>
        {content.text && (
          <Widget
            src="calebjacob.near/widget/SocialMarkdown"
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
            src="calebjacob.near/widget/LikeButton"
            props={{
              item: {
                type: "social",
                path: `${accountId}/post/comment`,
                blockHeight,
              },
              notifyAccountId,
            }}
          />
          <Widget
            src="calebjacob.near/widget/CommentButton"
            props={{
              hideCount: true,
              onClick: () => State.update({ showReply: !state.showReply }),
            }}
          />
          <Widget
            src="calebjacob.near/widget/CopyUrlButton"
            props={{
              url: commentUrl,
            }}
          />
        </Actions>
      )}

      {state.showReply && (
        <div className="mb-2">
          <Widget
            src="calebjacob.near/widget/Comments.Compose"
            props={{
              initialText: `@${accountId}, `,
              notifyAccountId: extractNotifyAccountId(parentItem),
              item: parentItem,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}
    </Body>
  </Comment>
);
