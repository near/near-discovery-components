// Copy of old version of feed from src/Feed.jsx
const index = {
  action: "post",
  key: "main",
  options: {
    limit: props.limit ?? 10,
    order: "desc",
    accountId: props.accounts,
  },
};

const Post = styled.div`
  border-bottom: 1px solid #eceef0;
`;

const renderItem = (a) =>
  a.value.type === "md" && (
    <Post key={JSON.stringify(a)}>
      <Widget
        src="${REPL_ACCOUNT}/widget/v1.Posts.Post"
        props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
      />
    </Post>
  );

return (
  <div>
    <Widget src="${REPL_MOB_2}/widget/IndexFeed" props={{ index, renderItem }} />
  </div>
);
