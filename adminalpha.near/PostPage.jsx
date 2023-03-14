const accountId = props.accountId;
const commentBlockHeight = parseInt(props.commentBlockHeight);
let parentPost = null;

const extractParentPost = (item) => {
  if (!item || item.type !== "social" || !item.path || !item.blockHeight) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path
    ? { accountId, blockHeight: item.blockHeight }
    : undefined;
};

if (commentBlockHeight) {
  const content = JSON.parse(
    Social.get(`${accountId}/post/comment`, commentBlockHeight) ?? "null"
  );

  if (content === null) {
    return "Loading";
  }

  parentPost = extractParentPost(content.item);
}

if (parentPost) {
  return (
    <Widget
      src="calebjacob.near/widget/Posts.Post"
      props={{
        ...parentPost,
        highlightComment: { accountId, blockHeight: commentBlockHeight },
        commentsLimit: 30,
        subscribe: true,
        raw: props.raw,
      }}
    />
  );
}

return (
  <Widget
    src="calebjacob.near/widget/Posts.Post"
    props={{ ...props, commentsLimit: 30, subscribe: true }}
  />
);
