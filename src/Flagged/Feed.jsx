const index = {
  action: "flag",
  key: "main",
  options: {
    limit: 10,
    order: "desc",
  },
};

const renderItem = (a) => {
  const item = a.value;
  if (!item || item.type !== "social" || !item.path) {
    return <></>;
  }
  const accountId = item.path.split("/")[0];

  let renderWidget;
  switch (item.path) {
    case `${accountId}/post/main`:
      renderWidget = (
        <Widget
          src="${REPL_ACCOUNT}/widget/Posts.Post"
          props={{ accountId, blockHeight: item.blockHeight }}
        />
      );
      break;
    case `${accountId}/post/comment`:
      renderWidget = (
        <Widget
          src="${REPL_ACCOUNT}/widget/Comments.Comment"
          props={{ accountId, blockHeight: item.blockHeight }}
        />
      );
      break;
    case `${accountId}/discuss`:
      renderWidget = (
        <Widget
          src="${REPL_ACCOUNT}/widget/NestedDiscussions.Preview"
          props={{
            accountId,
            blockHeight: item.blockHeight,
            dbAction: "discuss",
          }}
        />
      );
      break;
    default:
      break;
  }
  return (
    <div key={JSON.stringify(a)} className="mb-3">
      <div className="d-flex flex-row align-items-center">
        <div className="flex-grow-1 text-truncate">
          Reported by{" "}
          <Widget
            src="${REPL_MOB}/widget/ProfileLine"
            props={{ accountId: a.accountId, hideAccountId: true }}
          />
        </div>
        <div>
          <Widget
            src="${REPL_MOB_2}/widget/TimeAgo@${REPL_TIME_AGO_VERSION}"
            props={{ blockHeight: a.blockHeight }}
          />
        </div>
      </div>
      {renderWidget}
    </div>
  );
};

return (
  <div>
    {/*
      We continute to use the mob.near IndexFeed since it doesnt have moderation built in
      and we want this feed to show banned content
    */}
    <Widget
      src="${REPL_MOB_2}/widget/IndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
