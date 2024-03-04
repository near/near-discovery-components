let { fetchNotifications, notificationsCount, shouldFallback, manageNotification, permission, showLimit } = props;
showLimit = showLimit ?? 10;

const [notifications, setNotifications] = useState(notifications ?? []);

const renderItem = (item, i) => {
  if (i === 0) {
    Storage.set("lastBlockHeight", item.blockHeight);
  }
  const { accountId: initiator } = item;
  return (
    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.Notification"
      key={`${initiator}-${item.blockHeight}-${i}`}
      props={{ initiator, ...item, manageNotification, permission }}
    />
  );
};

const NotificationsListFromChain = () => {
  const index = {
    action: "notify",
    key: context.accountId,
    options: {
      limit: showLimit ?? 10,
      order: "desc",
      subscribe: true,
    },
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
};

const fetchData = (offset, limit) => {
  const notificationsMap = new Map();
  const notificationsList = fetchNotifications(offset, limit);

  [...notifications, ...notificationsList].forEach((notification) => {
    if (!notificationsMap.has(notification.id)) {
      notificationsMap.set(notification.id, notification);
    }
  });
  setNotifications([...notificationsMap.values()]);
};

useEffect(() => {
  if (shouldFallback) {
    return;
  }
  fetchData(0, showLimit);
}, [notificationsCount]);

const NotificationsFromGraphQL = ({ notifications }) => {
  const itemsLeft = notificationsCount - notifications.length;
  const limit = itemsLeft > showLimit ? showLimit : itemsLeft;

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => {
        fetchData(notifications.length, limit);
      }}
      hasMore={notifications.length < notificationsCount}
      initialLoad={false}
      loader={
        <div className="loader">
          <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
          Loading ...
        </div>
      }
    >
      {notifications.map(renderItem)}
    </InfiniteScroll>
  );
};

return (
  <>{shouldFallback ? <NotificationsListFromChain /> : <NotificationsFromGraphQL notifications={notifications} />}</>
);
