const GRAPHQL_ENDPOINT =
  props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const notifyAccountId = accountId;
const postUrl = `https://${REPL_NEAR_URL}/s/p?a=${accountId}&b=${blockHeight}`;

State.init({
  hasBeenFlagged: false,
  postExists: true,
  comments: props.comments ?? undefined,
  content: JSON.parse(props.content) ?? undefined,
  likes: props.likes ?? undefined,
});

const edits = []; // Social.index('edit', { accountId, blockHeight }, { limit: 1, order: "desc", accountId })

const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const toggleEdit = () => {
  State.update({ editPost: !state.editPost });
};

// Load post if contents and comments are not passed in
if (!state.content || !state.comments || !state.likes) {
  const postsQuery = `
query IndexerQuery {
  dataplatform_near_social_feed_posts(
    order_by: {block_height: desc}
    where: {_and: {block_height: {_eq: ${blockHeight}}, account_id: {_eq: "${accountId}"}}}
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

  fetchGraphQL(postsQuery, "IndexerQuery", {}).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const posts = result.body.data.dataplatform_near_social_feed_posts;
        if (posts.length > 0) {
          const post = posts[0];
          let content = JSON.parse(post.content);
          if (post.accounts_liked.length !== 0) {
            post.accounts_liked = JSON.parse(post.accounts_liked);
          }
          const comments = post.comments;
          State.update({
            content: content,
            comments: comments,
            likes: post.accounts_liked,
          });
        } else {
          State.update({
            postExists: false,
          });
        }
      }
    }
  });

  if (state.postExists == false) {
    return "Post does not exist";
  }
  return "loading...";
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
const CommentWrapper = styled.div`
  > div:first-child {
    > a:first-child {
      display: inline-flex;
      margin-bottom: 24px;
      font-size: 14px;
      line-height: 20px;
      color: #687076;
      outline: none;
      font-weight: 600;

      &:hover,
      &:focus {
        color: #687076;
        text-decoration: underline;
      }
    }
  }
`;

const renderComment = (a) => {
  return (
    <div key={JSON.stringify(a)}>
      <Widget
        src={`${REPL_ACCOUNT}/widget/Comments.Comment`}
        props={{
          accountId: a.account_id,
          blockHeight: a.block_height,
          content: a.content,
          highlight:
            a.account_id === props.highlightComment?.accountId &&
            a.block_height === props.highlightComment?.blockHeight,
          GRAPHQL_ENDPOINT,
        }}
      />
    </div>
  );
};

if (state.hasBeenFlagged) {
  return (
    <div className="alert alert-secondary">
      <i className="bi bi-flag" /> This content has been flagged for moderation
    </div>
  );
}

const renderedComments = state.comments.map(renderComment);

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
          {false && (
            <Widget
              src="${REPL_ACCOUNT}/widget/Posts.Menu"
              props={{
                elements: [
                  <button className={`btn`} onClick={toggleEdit}>
                    <i className="bi bi-pencil me-1" />
                    <span>Edit</span>
                  </button>,
                ],
              }}
            />
          )}
        </div>
      </div>
    </Header>

    <Body>
      {state.content && (
        <Content>
          {state.content.text && !state.editPost && (
            <Widget
              src="${REPL_ACCOUNT}/widget/SocialMarkdown"
              props={{ text: state.content.text }}
            />
          )}

          {state.editPost && (
            <div className="mb-2">
              <Widget
                src="${REPL_ACCOUNT}/widget/Posts.Edit"
                props={{
                  item: { accountId, blockHeight },
                  content: state.content,
                  onEdit: toggleEdit,
                }}
              />
            </div>
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
            src="${REPL_ACCOUNT}/widget/LikeButton"
            props={{
              item,
              notifyAccountId,
              likes: state.likes
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
            src="${REPL_ACCOUNT}/widget/ShareButton"
            props={{
              postType: "post",
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
      {renderedComments && (
        <Comments>
          <CommentWrapper>{renderedComments}</CommentWrapper>
        </Comments>
      )}
    </Body>
  </Post>
);
