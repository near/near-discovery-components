const { href } = VM.require("devhub.near/widget/core.lib.url") || (() => {});

function createNotificationMessage(notificationType, path, postValue, customMessage) {
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
      return "edited your";
    case "devgovgigs/like":
      return isDevHubPost ? "liked your post" : "liked your comment";
    case "devhub/like":
      return "liked your proposal";
    default:
      return null;
  }
}

function getNotificationContent(notificationType, notificationValue, path, postValue, context, accountId, blockHeight) {
  // Do not show content for these notification types
  // as they are not having any content
  let { item } = notificationValue;
  let { blockHeight: likeAtBlockHeight } = item;

  if (["follow", "unfollow", "poke"].indexOf(notificationType) >= 0) return null;

  const isComment = path.indexOf("/post/comment") > 0 || notificationType === "comment";
  const isPost = !isComment && path.indexOf("/post/main") > 0;

  if (notificationType && notificationType.startsWith("devgovgigs")) {
    const getDevHubContent = Near.view("devgovgigs.near", "get_post", {
      post_id: postValue,
    });
    return getDevHubContent.snapshot.description;
  }

  const commentAuthorAccountId = notificationType === "like" ? context.accountId : accountId;
  const contentBlockHeight = notificationType === "like" ? likeAtBlockHeight : blockHeight;

  const contentPath = isPost ? `${context.accountId}/post/main` : `${commentAuthorAccountId}/post/comment`;
  const contentDescription = JSON.parse(Social.get(contentPath, contentBlockHeight) ?? "null");
  return contentDescription.text;
}

function createNotificationLink(notificationType, notificationValue, authorAccountId, accountId, blockHeight) {
  const pathPrefix = `/${REPL_ACCOUNT}/widget`;

  let { item, widget, params, post, proposal, notifier } = notificationValue;
  item = item ?? {};
  widget = widget ?? "";
  params = params ?? {};
  post = post ?? {};
  proposal = proposal ?? "";
  notifier = notifier ?? "";
  let { blockHeight: likeAtBlockHeight, path } = item;
  path = path ?? "";

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
          notifier: notifier,
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
