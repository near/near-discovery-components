const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/main`, blockHeight) ?? "null");
const subscribe = !!props.subscribe;
const raw = !!props.raw;

const notifyAccountId = accountId;
const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const link = `#/${REPL_MOB_2}/widget/MainPage.Post.Page?accountId=${accountId}&blockHeight=${blockHeight}`;

const Post = styled.div`
  padding: 24px;

  @media (max-width: 1200px) {
    padding: 24px 12px;
  }
`;

return (
  <Post className="post">
    <Widget
      src="${REPL_MOB_2}/widget/MainPage.Post.Header"
      props={{ accountId, blockHeight, link, postType: "post" }}
    />
    <div className="mt-3 text-break">
      <Widget
        src="${REPL_MOB_2}/widget/MainPage.Post.Content"
        props={{ content, raw }}
      />
    </div>
    {blockHeight !== "now" && (
      <div className="mt-1 d-flex justify-content-between">
        <Widget
          src="${REPL_MOB_2}/widget/LikeButton"
          props={{
            notifyAccountId,
            item,
          }}
        />
        <Widget
          src="${REPL_MOB_2}/widget/CommentButton"
          props={{
            onClick: () =>
              !state.showReply && State.update({ showReply: true }),
          }}
        />
      </div>
    )}
    <div className="mt-3 ps-5">
      {state.showReply && (
        <div className="mb-2">
          <Widget
            src="${REPL_MOB_2}/widget/MainPage.Comment.Compose"
            props={{
              notifyAccountId,
              item,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}
      <Widget
        src="${REPL_MOB_2}/widget/MainPage.Comment.Feed"
        props={{
          item,
          highlightComment: props.highlightComment,
          limit: props.commentsLimit,
          subscribe,
          raw,
        }}
      />
    </div>
  </Post>
);
