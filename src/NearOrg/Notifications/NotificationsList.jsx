let { manageNotification, permission, showLimit } = props;
const { fetchGraphQL } = VM.require("${REPL_ACCOUNT}/widget/QueryApi.utils") || (() => {});

const [notifications, setNotifications] = useState([]);

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

const NotificationsFromGraphQL = () => {
  if (context.accountId) {
    const notificationsQuery = `query NotificationsQuery {
      dataplatform_near_notifications_notifications(
        where: {receiver: {_eq: "${context.accountId}"}}
        order_by: {blockHeight: desc}
      ) {
        id
        blockHeight
        initiatedBy
        itemType
        message
        path
        receiver
        valueType
        profile: account {
          name
          image
        }
      }
    }`;

    fetchGraphQL(notificationsQuery, "NotificationsQuery", {}).then((result) => {
      if (result.status === 200) {
        if (result.body.data) {
          const notificationsList = result.body.data.dataplatform_near_notifications_notifications;
          const notifications = notificationsList.map((notification) => {
            const name = notification.profile?.name;
            const image = notification.profile?.image ? JSON.parse(notification.profile.image) : null;
            const profile = name && image ? { name, image } : null;
            return {
              accountId: notification.initiatedBy,
              blockHeight: notification.blockHeight,
              profile,
              value: {
                item: {
                  // blockHeight
                  path: notification.path,
                  type: notification.itemType,
                },
                type: notification.valueType,
                message: notification.message,
              },
            };
          });
          // console.log("notifications", notifications);
          if (notifications.length > 0) {
            setNotifications(notifications);
          }
        }
      }
    });
  }

  // data sample from graphql

  // blockHeight: 108409881
  // id: 110942
  // initiatedBy:"dima_sheleg_test.near"
  // itemType: "social"
  // message: null
  // path: "dima_sheleg.near/post/main"
  // profile: null
  // receiver: "dima_sheleg.near"
  // valueType: "like"

  // data sample from chain
  // accountId: "dima_sheleg_test.near"
  // blockHeight: 108409881
  // value: {
  //   item: {
  //     blockHeight: 99480931
  //     path: "dima_sheleg.near/post/main"
  //     type: "social"
  //   },
  //   type: "like"
  // }

  // devhub post
  // accountId: "frol.near"
  // blockHeight: 100248943
  // value: {
  //   post: 1152,
  //   type: "devgovgigs/reply"
  // }

  console.log("here we go!", notifications);

  return <>{notifications.map(renderItem)}</>;
};

// return <NotificationsListFromChain />;
return <NotificationsFromGraphQL />;
