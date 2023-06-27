const indexKey = props.indexKey;
const moderatorAccount = props.moderatorAccount;

const parentComponent = props.parentComponent;
const parentParams = props.parentParams;
const highlightComment = props.highlightComment;

const index = {
  action: "discuss",
  key: indexKey,
  options: { subscribe: true },
};

const Post = styled.div`
  padding: 24px 0 12px;

  @media (max-width: 1200px) {
    padding: 12px 0 0;
  }
`;

const renderItem = ({ accountId, blockHeight }) => (
  <Post className="post">
    <Widget
      src="${REPL_ACCOUNT}/widget/NestedDiscussions.Preview"
      props={{
        accountId,
        blockHeight,
        moderatorAccount,
        parentComponent,
        parentParams,
        highlightComment,
      }}
    />
  </Post>
);

return (
  <>
    <Widget
      src="${REPL_ACCOUNT}/widget/IndexFeed"
      props={{ index, renderItem, moderatorAccount, reverse: true }}
    />
  </>
);
