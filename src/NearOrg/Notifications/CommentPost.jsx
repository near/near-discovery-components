const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);

const content = JSON.parse(
  Social.get(`${accountId}/post/comment`, blockHeight) ?? "null",
);
if (content === null) {
  return "Loading";
}
const item = content.item;

const extractParentPost = (item) => {
  if (!item || item.type !== "social" || !item.path || !item.blockHeight) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path
    ? { accountId, blockHeight: item.blockHeight }
    : undefined;
};

const parentPost = extractParentPost(item);
return parentPost ? (
  <Widget
    src="${REPL_MOB}/widget/MainPage.N.Post"
    props={{
      ...parentPost,
      noBorder: true,
      highlightComment: { accountId, blockHeight },
      commentsLimit: props.commentsLimit || 30,
      subscribe: props.subscribe || true,
      raw: props.raw,
    }}
  />
) : (
  <Widget
    src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.CommentContent"
    props={props}
  />
);
