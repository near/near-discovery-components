const accountId = props.accountId;
const blockHeight = parseInt(props.blockHeight);

const content = JSON.parse(Social.get(`${accountId}/post/comment`, blockHeight) ?? "null");
if (content === null) {
  return "Loading";
}
const item = content.item;

const extractParentPost = (item) => {
  if (!item || item.type !== "social" || !item.path || !item.blockHeight) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path ? { accountId, blockHeight: item.blockHeight } : undefined;
};

const PostWrapper = styled.div`
  width: fit-content;
`;

const parentPost = extractParentPost(item);

return (
  <PostWrapper>
    {parentPost ? (
      <Widget
        src={`${REPL_ACCOUNT}/widget/Posts.Post`}
        props={{
          accountId: parentPost.accountId,
          blockHeight: item.blockHeight,
          highlightComment: { accountId, blockHeight },
        }}
      />
    ) : (
      <Widget src={`${REPL_ACCOUNT}/widget/NearOrg.Notifications.CommentContent`} props={props} />
    )}
  </PostWrapper>
);
