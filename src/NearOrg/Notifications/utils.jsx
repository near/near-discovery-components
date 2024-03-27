const { href } = VM.require("devhub.near/widget/core.lib.url") || (() => {});

if (!href) {
  console.error("Loading `href` module...");
  return "";
}

function createNotificationMessage(value) {
  const path = value?.item?.path ?? "";
  const postValue = value?.post ?? value?.proposal ?? "";
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
    case "devhub/reply":
      return "replied to your proposal";
    case "mention":
    case "devgovgigs/mention":
      return "mentioned you in their post";
    case "devhub/mention":
      return "mentioned you in their proposal";
    case "poke":
      return "poked you";
    case "star":
      return "starred your component";
    case "custom":
      return customMessage ?? "";
    case "devgovgigs/edit":
    case "devhub/edit":
      return "edited your post";
    case "devgovgigs/like":
      return isDevHubPost ? "liked your post" : "liked your comment";
    case "devhub/like":
      return "liked your proposal";
    default:
      return null;
  }
}

function getNotificationContent(value, contextAccountId, accountId, blockHeight) {
  const path = value?.item?.path ?? "";
  const postValue = value?.post ?? value?.proposal ?? "";
  const notificationType = value?.type ?? "";
  // Do not show content for these notification types
  // as they are not having any content
  const likeAtBlockHeight = value?.item?.blockHeight ?? undefined;

  if (["follow", "unfollow", "poke"].indexOf(notificationType) >= 0) return null;

  const isComment = path.indexOf("/post/comment") > 0 || notificationType === "comment";
  const isPost = !isComment && path.indexOf("/post/main") > 0;

  if (postValue && notificationType && notificationType.startsWith("devgovgigs")) {
    const getDevHubContent = Near.view("devgovgigs.near", "get_post", {
      post_id: postValue,
    });
    return getDevHubContent.snapshot.description;
  }

  const commentAuthorAccountId = notificationType === "like" ? contextAccountId : accountId;
  const contentBlockHeight = notificationType === "like" ? likeAtBlockHeight : blockHeight;

  const contentPath = isPost ? `${contextAccountId}/post/main` : `${commentAuthorAccountId}/post/comment`;
  if (!contentBlockHeight) {
    console.error("Block height is missing for content description.", value);
    return null;
  }
  const contentDescription = JSON.parse(Social.get(contentPath, contentBlockHeight) ?? "null");
  return contentDescription.text;
}

function createNotificationLink(notificationValue, authorAccountId, accountId, blockHeight) {
  const pathPrefix = `/${REPL_ACCOUNT}/widget`;
  const notificationType = notificationValue?.type ?? "";

  const widget = notificationValue?.widget ?? "";
  const params = notificationValue?.params ?? {};
  const post = notificationValue?.post ?? {};
  const proposal = notificationValue?.proposal ?? "";
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
    case "devhub/mention":
    case "devhub/edit":
    case "devhub/reply":
    case "devhub/like":
      return href({
        widgetSrc: "devhub.near/widget/app",
        params: {
          page: "proposal",
          id: proposal,
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
    case "devhub/like":
      return "ph ph-heart";
    case "fork":
      return "ph ph-git-fork";
    case "follow":
      return "ph ph-user-plus";
    case "unfollow":
      return "ph ph-user-minus";
    case "comment":
    case "devgovgigs/reply":
    case "devhub/reply":
      return "ph ph-share-fat";
    case "mention":
    case "devgovgigs/mention":
    case "devhub/mention":
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

return {
  createNotificationMessage,
  getNotificationContent,
  createNotificationLink,
  getNotificationIconClassName,
};
