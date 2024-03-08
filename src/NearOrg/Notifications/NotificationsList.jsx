let { fetchNotifications, shouldFallback, manageNotification, permission, showLimit } = props;
// showLimit means to fetch notificaitions for the preview and not the full list

const [notifications, setNotifications] = useState(notifications ?? []);
const [notificationsCount, setNotificationsCount] = useState(notificationsCount ?? 0);

const notificationsMap = new Map();

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

const saveData = (newNotifications, notificationsTotal) => {
  if (notificationsCount !== notificationsTotal) {
    setNotificationsCount(notificationsTotal);
  }

  [...notifications, ...newNotifications].forEach((notification) => {
    if (!notificationsMap.has(notification.id)) {
      notificationsMap.set(notification.id, notification);
    }
  });
  setNotifications([...notificationsMap.values()]);
};

const fetchData = (offset, limit) => {
  if (notifications.length > 0 && showLimit) return;
  fetchNotifications(offset, limit, saveData);
};

useEffect(() => {
  if (shouldFallback) {
    return;
  }
  fetchData(notifications.length, showLimit ?? 10);
  () => {
    setNotifications([]);
  };
}, [notificationsCount]);

const NotificationsFromGraphQL = ({ notifications }) => {
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => {
        fetchData(notifications.length, showLimit ?? 10);
      }}
      hasMore={!showLimit && notifications.length < notificationsCount}
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
