// Copy of old version of feed from src/Posts/Feed.jsx
const index = {
  action: "post",
  key: "main",
  options: {
    limit: 10,
    order: "desc",
    accountId: props.accounts,
  },
};

const Post = styled.div`
  border-bottom: 1px solid #eceef0;
  padding: 24px 0 12px;

  @media (max-width: 1024px) {
    padding: 12px 0 0;
  }
`;

const renderItem = (a) =>
  a.value.type === "md" && (
    <Post className="post" key={JSON.stringify(a)}>
      <Widget
        src="${REPL_ACCOUNT}/widget/v1.Posts.Post"
        props={{
          accountId: a.accountId,
          blockHeight: a.blockHeight,
          showFlagAccountFeature: props.showFlagAccountFeature,
        }}
      />
    </Post>
  );

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/IndexFeed"
    props={{ index, renderItem, moderatorAccount: "${REPL_MODERATOR}" }}
  />
);
