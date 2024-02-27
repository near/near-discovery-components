const { fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/Entities.QueryApi.utils") || (() => {});

const [shouldFallback, setShouldFallback] = useState(false);
const [notifications, setNotifications] = useState([]);
const [notificationsCount, setNotificationsCount] = useState(0);

const lastNotificationQuery = `
  query IndexerQuery {
    data: dataplatform_near_notifications_notifications( limit: 1, order_by: { block_height: desc }) {
      blockHeight
    }
  }
`;

const notificationsQuery = `query NotificationsQuery($offset: Int, $limit: Int) {
  data: dataplatform_near_notifications_notifications(
    where: {receiver: {_eq: "${context.accountId}"}}
    order_by: {blockHeight: desc},
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
  count: dataplatform_near_notifications_notifications_aggregate(where: {receiver: {_eq: "${context.accountId}"}}) {
    aggregate {
      count
    }
  }
}`;

const lastNotificationOnChain = Social.index("notify", context.accountId, {
  limit: 1,
  order: "desc",
});

const fetchNotifications = (offset, limit) => {
  fetchGraphQL(notificationsQuery, "NotificationsQuery", { offset, limit }).then((result) => {
    if (result.status === 200) {
      if (result.body.data) {
        const { data: notificationsList } = result.body.data;
        const { count: notificationsLeft } = result.body.data.count.aggregate;

        console.log("notificationsList: ", notificationsList, "count: ", notificationsLeft);

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
                path: notification.path,
                type: notification.itemType,
                post: notification?.devhubPostId,
              },
              type: notification.valueType,
              message: notification.message,
            },
          };

          return dataSample;
        });

        setNotifications(newNotifications);
        setNotificationsCount(notificationsLeft);
      }
    }
  });
  return notifications;
};

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
return (
  <Widget
    src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationsList"
    props={{ fetchNotifications, notificationsCount, shouldFallback, ...props }}
  />
);
