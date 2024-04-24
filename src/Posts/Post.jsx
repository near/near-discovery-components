const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const accountId = props.accountId;
const verifications = props.verifications;
const blockHeight = props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const blockTimestamp = props.blockTimestamp;
const notifyAccountId = accountId;
const postUrl = `https://${REPL_NEAR_URL}/s/p?a=${accountId}&b=${blockHeight}`;
const showFlagAccountFeature = props.showFlagAccountFeature;
const profile = props.profile;
const parsedContent = props.content
  ? typeof props.content === "string"
    ? JSON.parse(props.content)
    : props.content
  : undefined;

State.init({
  hasBeenFlaggedOptimistic: false,
  hasBeenFlagged: false,
  showToast: false,
  flaggedMessage: { header: "", detail: "" },
  postExists: true,
  comments: props.comments ?? undefined,
  content: parsedContent,
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
if (!state.content || !state.likes) {
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
  //   const postsQuery = `
  //   query IndexerQuery($offset: Int, $limit: Int) {
  //     dataplatform_near_social_feed_reposts_v12_posts_with_reposts_feed(${queryFilter} order_by: [${querySortOption} { block_height: desc }], offset: $offset, limit: $limit) {
  //       account_id
  //       block_height
  //       block_timestamp
  //       content
  //       receipt_id
  //       accounts_liked
  //       last_comment_timestamp
  //     }

  //   }
  // `;

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
        // const posts = result.body.data.dataplatform_near_social_feed_posts;
        const posts = result.body.data.dataplatform_near_social_feed_posts;
        if (posts.length > 0) {
          console.log("made it here!");
          const post = posts[0];
          let content = JSON.parse(post?.content);
          console.log("post", post);
          if (post?.accounts_liked.length !== 0) {
            if (typeof post.accounts_liked === "string") {
              post.accounts_liked = JSON.parse(post.accounts_liked);
            }
          }
          const comments = post?.comments;
          State.update({
            content: content,
            comments: comments,
            likes: post.accounts_liked,
          });
        } else {
          console.log("-----post does not exist------");
          State.update({
            postExists: false,
          });
        }
      }
    }
  });

  if (state.postExists == false) {
    console.log("post does not exist we are ln 121");
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

const optimisticallyHideItem = (message) => {
  State.update({
    hasBeenFlaggedOptimistic: true,
    showToast: true,
    flaggedMessage: message,
  });
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
          notifyAccountId,
          item,
        }}
      />
    </div>
  );
};

// const renderedComments = state.comments.map(renderComment);

const addNewCommentFn = (newComment) => {
  State.update(state.comments.push(newComment));
};

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
      <Post>
        <Header>
          <div className="row">
            <div className="col-auto">
              <Widget
                src="${REPL_ACCOUNT}/widget/AccountProfile"
                props={{
                  profile,
                  verifications,
                  accountId,
                  hideAccountId: true,
                  inlineContent: (
                    <>
                      <Text as="span">･</Text>
                      <Text>
                        <Widget src="${REPL_ACCOUNT}/widget/TimeAgo" props={{ blockHeight, blockTimestamp }} />
                      </Text>
                      {false && edits.length > 0 && <Text as="span">･ Edited</Text>}
                    </>
                  ),
                  showFlagAccountFeature,
                }}
              />
            </div>
            <div className="col-1">
              <div style={{ position: "absolute", right: 0, top: "2px" }}>
                <Widget
                  src="${REPL_ACCOUNT}/widget/Posts.Menu"
                  props={{
                    item,
                    accountId: accountId,
                    blockHeight: blockHeight,
                    parentFunctions: {
                      toggleEdit,
                      optimisticallyHideItem,
                      resolveHideItem,
                      cancelHideItem,
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Header>

        {!state.hasBeenFlaggedOptimistic && (
          <Body>
            {state.content && (
              <Content>
                {state.content.text && !state.editPost && (
                  <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: state.content.text }} />
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
                  src="${REPL_ACCOUNT}/widget/v1.LikeButton"
                  props={{
                    item,
                    notifyAccountId,
                    likes: state.likes,
                  }}
                />

                <Widget
                  src="${REPL_ACCOUNT}/widget/CommentButton"
                  props={{
                    item,
                    onClick: () => State.update({ showReply: !state.showReply }),
                  }}
                />

                {/* <Widget
                  src="${REPL_ACCOUNT}/widget/Posts.RepostButton"
                  props={{
                    item,
                  }}
                /> */}
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
                    newAddedComment: addNewCommentFn,
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
        )}
      </Post>
    )}
  </>
);
