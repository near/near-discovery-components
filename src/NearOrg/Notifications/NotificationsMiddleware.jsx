const { fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.Client") || (() => {});

if (!fetchGraphQL) return <></>;

const accountId = context.accountId;

const [shouldFallback, setShouldFallback] = useState(false);

const lastNotificationQuery = `
  query IndexerQuery {
    data: dataplatform_near_notifications_notifications( limit: 1, order_by: { blockHeight: desc }) {
      blockHeight
    }
  }
`;

const notificationsQuery = `query NotificationsQuery($offset: Int, $limit: Int) {
  data: dataplatform_near_notifications_notifications(
    distinct_on: [blockHeight, initiatedBy],
    where: {receiver: {_eq: "${accountId}"}}
    order_by: [{blockHeight: desc}, {initiatedBy:asc}],
    offset: $offset, limit: $limit
  ) {
    id
    blockHeight
    initiatedBy
    itemType
    message
    path
    receiver
    valueType
    devhubPostId
    actionAtBlockHeight
    profile: account {
      name
      image
      tags
    }
  }
  count: dataplatform_near_notifications_notifications_aggregate(
    distinct_on: [blockHeight, initiatedBy],
    where: {receiver: {_eq: "${accountId}"}}
  ) {
    aggregate {
      count
    }
  }
}`;

const lastNotificationOnChain = Social.index("notify", accountId, {
  limit: 1,
  order: "desc",
});

const fetchNotifications = (offset, limit, saveData) => {
  fetchGraphQL(notificationsQuery, "NotificationsQuery", { offset, limit }).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const { data: notificationsList } = result.body.data;
        const { count: notificationsTotal } = result.body.data.count.aggregate;

        const newNotifications = notificationsList.map((notification) => {
          const name = notification.profile?.name;
          const image = notification.profile?.image ? JSON.parse(notification.profile.image) : null;
          const profile = name && image ? { name, image } : null;
          const dataSample = {
            accountId: notification.initiatedBy,
            blockHeight: notification.blockHeight,
            id: notification.id,
            profile,
            value: {
              item: {
                blockHeight: notification?.actionAtBlockHeight,
                path: notification?.path,
                type: notification?.itemType,
              },
              type: notification.valueType,
              message: notification.message,
            },
          };
          if (notification?.devhubPostId) {
            dataSample.value.post = notification.devhubPostId;
          }

          return dataSample;
        });

        saveData(newNotifications, notificationsTotal);
      }
    }
  });
};

const fetchLastNotification = () =>
  fetchGraphQL(lastNotificationQuery, "IndexerQuery", {})
    .then((result) => {
      if (result && result.body.data.data.length > 0) {
        const nearSocialBlockHeight = lastNotificationOnChain[0].blockHeight;
        const feedIndexerBlockHeight = result.body.data.data[0].blockHeight;

        const lag = nearSocialBlockHeight - feedIndexerBlockHeight;
        let shouldFallback = lag > 2 || !feedIndexerBlockHeight;
        if (shouldFallback === true) {
          console.log(
            "Falling back to Social index notifications. Block difference is: ",
            nearSocialBlockHeight - feedIndexerBlockHeight,
          );
          setShouldFallback(true);
        }
      }
    })
    .catch((error) => {
      console.log("Error while fetching QueryApi notifications (falling back to index notifications): ", error);
      setShouldFallback(true);
    });

useEffect(() => {
  fetchLastNotification();
  () => {
    setShouldFallback(false);
    setNotifications([]);
    setNotificationsCount(0);
  };
}, [lastNotificationOnChain]);

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList"
    props={{ fetchNotifications, shouldFallback, ...props }}
  />
);
