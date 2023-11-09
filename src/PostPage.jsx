if (!props.accountId || !(props.blockHeight || props.commentBlockHeight)) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Invalid link, one or more parameters are missing.
    </div>
  );
}

const renderPost = (post) => {
  return <Widget src="${REPL_ACCOUNT}/widget/Posts.Post" props={{ ...post }} />;
};
const renderData = (dataProps) => {
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/Posts.ModeratedPostData"
      props={{ ...dataProps, renderPost }}
    />
  );
};

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/Moderation.CheckPostModeration"
    props={{ ...props, renderData }}
  />
);
