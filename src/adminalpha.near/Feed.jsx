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
  border-bottom: 1px solid #ECEEF0;
`;

const renderItem = (a) =>
  a.value.type === "md" && (
    <Post key={JSON.stringify(a)}>
      <Widget
        src="calebjacob.near/widget/Feed.Post"
        props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
      />
    </Post>
  );

return (
  <div>
    <Widget src="mob.near/widget/IndexFeed" props={{ index, renderItem }} />
  </div>
);
