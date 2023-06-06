const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const subscribe = !!props.subscribe;
const notifyAccountId = accountId;
const postUrl = `https://${REPL_NEAR_URL}#/${REPL_ACCOUNT}/widget/PostPage?accountId=${accountId}&blockHeight=${blockHeight}`;

State.init({ hasBeenFlagged: false });

const edits = [] // Social.index('edit', { accountId, blockHeight }, { limit: 1, order: "desc", accountId })

const content =
  props.content ??
  JSON.parse(
    edits.length ? Social.get(`${accountId}/edit/main`, edits.blockHeight)
      : Social.get(`${accountId}/post/main`, blockHeight)
  );

const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const toggleEdit = () => {
  State.update({ editPost: !state.editPost });
}

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
      <div className="row">
        <div className="col-auto">
          <Widget
            src="${REPL_ACCOUNT}/widget/AccountProfile"
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
                          src="${REPL_MOB_2}/widget/TimeAgo"
                          props={{ blockHeight }}
                        />{" "}
                        ago
                      </>
                    )}
                  </Text>
                  {false && edits.length > 0 && <Text as="span">･ Edited</Text>}
                </>
              ),
            }}
          />
        </div>
        <div className="col-1">
          {false &&
            <Widget src="${REPL_ACCOUNT}/widget/Posts.Menu"
              props={{
                elements: [
                  <button
                    className={`btn`}
                    onClick={toggleEdit} >
                    <i className="bi bi-pencil me-1" />
                    <span>Edit</span>
                  </button>
                ]
              }}
            />
          }
        </div>
      </div>
    </Header>

    <Body>
      <Content>
        {content.text && !state.editPost && (
          <Widget
            src="${REPL_ACCOUNT}/widget/SocialMarkdown"
            props={{ text: content.text }}
          />
        )}

        {state.editPost && (
          <div className="mb-2">
            <Widget
              src="${REPL_ACCOUNT}/widget/Posts.Edit"
              props={{
                item: { accountId, blockHeight },
                content,
                onEdit: toggleEdit
              }}
            />
          </div>
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
            src="${REPL_ACCOUNT}/widget/LikeButton"
            props={{
              item,
              notifyAccountId,
            }}
          />
          <Widget
            src="${REPL_ACCOUNT}/widget/CommentButton"
            props={{
              item,
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
            src="${REPL_ACCOUNT}/widget/Comments.Compose"
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
          src="${REPL_ACCOUNT}/widget/Comments.Feed"
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
