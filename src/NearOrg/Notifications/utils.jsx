const { href } = VM.require("devhub.near/widget/core.lib.url") || (() => {});

if (!href) return {};

function createNotificationMessage(value) {
  if (!value) return null;
  const path = value?.item?.path ?? "";
  const postValue = value?.post ?? value?.proposal ?? null;
  const notificationType = value?.type ?? "";
  const customMessage = value?.message ?? null;

  const isComment = path.indexOf("/post/comment") > 0 || notificationType === "comment";
  const isPost = !isComment && path.indexOf("/post/main") > 0;

  const getDevHubPostParentId = postValue
    ? Near.view("devgovgigs.near", "get_parent_id", {
        post_id: postValue,
      })
    : undefined;

  const isDevHubPost = getDevHubPostParentId === null;

  switch (notificationType) {
    case "like":
      return isPost ? "liked your post" : "liked your comment";
    case "follow":
      return "followed you";
    case "unfollow":
      return "unfollowed you";
    case "comment":
    case "devgovgigs/reply":
      return "replied to your post";
    case "proposal/reply":
      return "replied to your proposal";
    case "rfp/reply":
      return "replied to your RFP";
    case "mention":
    case "devgovgigs/mention":
      return "mentioned you in their post";
    case "proposal/mention":
      return "mentioned you in their proposal";
    case "rfp/mention":
      return "mentioned you in their RFP";
    case "poke":
      return "poked you";
    case "star":
      return "starred your component";
    case "custom":
      return customMessage ?? "";
    case "devgovgigs/edit":
    case "proposal/edit":
      return "edited your proposal";
    case "rfp/edit":
      return "edited the RFP";
    case "devgovgigs/like":
      return isDevHubPost ? "liked your post" : "liked your comment";
    case "proposal/like":
      return "liked your proposal";
    case "rfp/like":
      return "liked the RFP";
    default:
      return null;
  }
}

function getNotificationContent(value, contextAccountId, accountId, blockHeight) {
  if (!value) return null;
  const path = value?.item?.path ?? "";
  const postValue = value?.post ?? value?.proposal ?? null;
  const notificationType = value?.type ?? "";
  // Do not show content for these notification types
  // as they are not having any content
  const likeAtBlockHeight = value?.item?.blockHeight ?? undefined;

  if (["follow", "unfollow", "poke"].indexOf(notificationType) >= 0) return null;

  const isComment = path.indexOf("/post/comment") > 0 || notificationType === "comment";
  const isPost = !isComment && path.indexOf("/post/main") > 0;

  if (notificationType && notificationType.startsWith("devgovgigs") && postValue) {
    const getDevHubContent = Near.view("devgovgigs.near", "get_post", {
      post_id: postValue,
    });
    return getDevHubContent.snapshot.description ?? null;
  }

  const commentAuthorAccountId = notificationType === "like" ? contextAccountId : accountId;
  const contentBlockHeight = notificationType === "like" ? likeAtBlockHeight : blockHeight;

  const contentPath = isPost ? `${contextAccountId}/post/main` : `${commentAuthorAccountId}/post/comment`;
  const getDescription = Social.get(contentPath, contentBlockHeight);
  if (!getDescription) return null;
  const contentDescription = JSON.parse(getDescription);
  return contentDescription.text;
}

function createNotificationLink(notificationValue, authorAccountId, accountId, blockHeight) {
  if (!notificationValue) return null;
  const pathPrefix = `/${REPL_ACCOUNT}/widget`;
  const notificationType = notificationValue?.type ?? null;

  const widget = notificationValue?.widget ?? "";
  const params = notificationValue?.params ?? {};
  const post = notificationValue?.post ?? {};
  const proposal = notificationValue?.proposal ?? "";
  const rfp = notificationValue?.rfp ?? "";
  const widgetAccountId = notificationValue?.widgetAccountId ?? "";
  const likeAtBlockHeight = notificationValue?.item?.blockHeight ?? undefined;
  const path = notificationValue?.item?.path ?? "";

  switch (notificationType) {
    case "mention":
      return `${pathPrefix}/NearOrg.Notifications.CommentPost?accountId=${authorAccountId}&blockHeight=${blockHeight}`;
    case "custom":
      return `/${widget}?${Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")}`;
    case "like":
      const isComment = path.indexOf("/post/comment") > 0 || notificationType === "comment";
      const pathAccountId = path.split("/")[0];
      if (isComment) {
        return `${pathPrefix}/NearOrg.Notifications.CommentPost?accountId=${pathAccountId}&blockHeight=${likeAtBlockHeight}`;
      }
      return `${pathPrefix}/PostPage?accountId=${pathAccountId}&blockHeight=${likeAtBlockHeight}`;
    case "comment":
      return `${pathPrefix}/PostPage?accountId=${authorAccountId}&commentBlockHeight=${blockHeight}`;
    case "star":
      return `${pathPrefix}/ComponentDetailsPage?src=${path}`;
    case "devgovgigs/mention":
    case "devgovgigs/edit":
    case "devgovgigs/reply":
    case "devgovgigs/like":
      return href({
        widgetSrc: "devhub.near/widget/app",
        params: {
          page: "post",
          id: post,
        },
      });
    case "proposal/mention":
    case "proposal/edit":
    case "proposal/reply":
    case "proposal/like":
      return href({
        widgetSrc: `${widgetAccountId}/widget/app`,
        params: {
          page: "proposal",
          id: proposal,
        },
      });
    case "rfp/mention":
    case "rfp/edit":
    case "rfp/reply":
    case "rfp/like":
      return href({
        widgetSrc: `${widgetAccountId}/widget/app`,
        params: {
          page: "rfp",
          id: rfp,
        },
      });
    default:
      return `${pathPrefix}/PostPage?accountId=${accountId}&blockHeight=${blockHeight}`;
  }
}

function getNotificationIconClassName(notificationType) {
  switch (notificationType) {
    case "like":
    case "devgovgigs/like":
    case "proposal/like":
    case "rfp/like":
      return "ph ph-heart";
    case "fork":
      return "ph ph-git-fork";
    case "follow":
      return "ph ph-user-plus";
    case "unfollow":
      return "ph ph-user-minus";
    case "comment":
    case "devgovgigs/reply":
    case "proposal/reply":
    case "rfp/reply":
      return "ph ph-share-fat";
    case "mention":
    case "devgovgigs/mention":
    case "proposal/mention":
    case "rfp/mention":
      return "ph ph-at";
    case "poke":
      return "ph ph-hand-pointing";
    case "star":
      return "ph ph-star";
    case "custom":
      return "ph ph-bell-simple";
    default:
      return "ph ph-bell-simple";
  }
}

/*
  @value - Notification value object
  @description - Check if the notification value object has all the required fields
*/

function checkNotificationValueAvailability(value) {
  if (!value) {
    console.error("Notification value is missing.");
    return false;
  }
  const notificationType = value?.type ?? null;
  if (!notificationType) {
    console.error("Notification type is missing.");
    return false;
  }
  const type = value?.item?.type ?? null;
  const path = value?.item?.path ?? null;
  const blockHeight = value?.item?.blockHeight ?? null;
  // devhub specific
  const post = value?.post ?? null;
  const notifier = value?.notifier ?? null;
  const proposal = value?.proposal ?? null;
  const rfp = value?.rfp ?? null;

  switch (notificationType) {
    case "like":
    case "comment":
      return !(!type || !path || !blockHeight);
    case "follow":
    case "unfollow":
    case "poke":
      return true;
    case "mention":
    case "star":
      return !(!type || !path);
    case "devgovgigs/like":
    case "devgovgigs/reply":
    case "devgovgigs/mention":
    case "devgovgigs/edit":
      return !(!type || !post);
    case "proposal/like":
      return !(!type || !proposal);
    case "rfp/like":
      return !(!type || !rfp);
    case "proposal/edit":
    case "proposal/mention":
      return !(!type || !notifier || !proposal);
    case "rfp/edit":
    case "rfp/mention":
      return !(!type || !notifier || !rfp);
    case "proposal/reply":
      return !(!type || !path || !blockHeight || !proposal);
    case "rfp/reply":
      return !(!type || !path || !blockHeight || !rfp);
    default:
      return false;
  }
}

return {
  createNotificationMessage,
  getNotificationContent,
  createNotificationLink,
  getNotificationIconClassName,
  checkNotificationValueAvailability,
};
