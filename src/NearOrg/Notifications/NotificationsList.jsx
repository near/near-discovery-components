let { manageNotification, permission, showLimit } = props;

const index = {
  action: "notify",
  key: context.accountId,
  options: {
    limit: showLimit ?? 10,
    order: "desc",
    subscribe: true,
  },
};

const renderItem = (item, i) => {
  if (i === 0) {
    Storage.set("lastBlockHeight", item.blockHeight);
  }
  const { accountId: initiator } = item;
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Notification"
      key={JSON.stringify(item)}
      props={{ initiator, ...item, manageNotification, permission }}
    />
  );
};

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/IndexFeed"
    props={{
      index,
      manual: !!showLimit,
      renderItem,
      nextLimit: 10,
      initialRenderLimit: showLimit ?? 10,
      moderatorAccount: "${REPL_MODERATOR}",
    }}
  />
);
